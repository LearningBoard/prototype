define(['util', 'mdls/User', 'mdls/Activity', 'temps/ActivityTemplate', 'temps/SortableListTemplate', 'temps/ActivityListTemplate', 'temps/ActivityTabTemplate', 'lib/ViewDispatcher', 'jquery_ui', 'fileinput', 'select2'], function (util, user, Activity, ActivityTemplate, SortableListTemplate, ActivityListTemplate, ActivityTabTemplate, ViewDispatcher, ui, fi) {

  var pk;
  var cover_img = 'empty';
  var tag_list = [];
  var activity_index = 0;
  var actList;
  var actFormTemp = {};
  var serv_addr = util.serv_addr;

  $.getCSS('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css');

  $(function(){
    // load category data
    var actTempList = [];
    util.get('/category/',
      function(res)
      {
        var data = res.data;
        for(var i = 0; i < data.category.length; i++){
          $('select[name=category]')
          .append(`
            <option value="${data.category[i].id}">
              ${data.category[i].name}
            </option>`
          );
        }
      }
    );

    // reset data for new board
    if(location.search.includes('?new')){
      $("div[class=curated_by] span").text(user.getInfo().username);

      $('.navbar-nav li:not(:first) a').css({
        color: '#CCC',
        cursor: 'not-allowed'
      });

      initCoverImage('https://placehold.it/300x200');
    }

    // assign value to field when editing the board
    if(/\?\d+/.test(location.search)){
      pk = location.search.replace('?', '');
      util.get('/lb/'+pk+'/',
        function(res){
          // get the info of the board with pk
          var board = res.data.learningboard;
          if(board.publish == 1){
            $('.publishBoardBtn').parent().addClass('hidden');
            $('.unpublishBoardBtn').parent().removeClass('hidden');
          }
          if(board.tags){
            board.tags.map(function(item){
              tag_list.push(item.id);
              $('.tagList ul')
              .append(`
                <li data-id="${item.id}">
                  ${item.tag} <span>x</span>
                </li>`
              );
            });
          }
          $('form.addBoardForm input[name=title]')
          .val(board.title)
          .trigger('keydown');
          $("div[class=curated_by] span").text(board.author.username);
          $('form.addBoardForm textarea[name=description]')
          .val(board.description);
          $('form.addBoardForm input[name=level][value='+board.level+']')
          .prop('checked', true);
          if(board.activities && board.activities.length > 0){
            $('.activityListContainer .noActivity').hide();
            var activities = board.activities;
            var length = activities.length;
            var actTemps = util.arrayMapping(activities,
              function(activity, index) {
              return new ActivityTemplate(activity, index);
            });
            actList = new SortableListTemplate(new ActivityListTemplate(actTemps), util.urls.actOrder);
            actList.display($(".activityListContainer"));
          }
          else
          {
            actList = new SortableListTemplate(new ActivityListTemplate(), util.urls.actOrder);
            actList.display($(".activityListContainer"));
          }
          $('.navbar-nav li:not(:first) a').css({});
          initCoverImage(board.image_url ? serv_addr + board.image_url: "img/placeholder-no-image.png");
        },
        function(){
          alert('Learning Board not found');
          location.href = 'boards.html';
        }
      );
    }
    else{
      actList = new SortableListTemplate(new ActivityListTemplate(), util.urls.actOrder);
      actList.display($(".activityListContainer"));
    }
    $(".btn.sortLockMode").on("click", function() {
      actList.toggleSortingEnabled();
      if (actList.sortingEnabled) {$(this).html("Sorting Enabled");} 
      else {$(this).html("Sorting Disabled");} 
    })

    // render add/edit activity form
    var actTypes = ViewDispatcher.activities.getTypes();
    actTypes.forEach(function(act){
      ViewDispatcher.activities.getCreateFormView(act).then(function(form){
        form.display($('.activityForm'));
        tab = new ActivityTabTemplate(form.name, form.type);
        tab.display($('#activityTab'));
        actFormTemp[form.type] = form;
      }).catch(function(e){
        throw e;
      });
    });


    // board title word count
    $('#boardTitle').on('keydown', function(e){
      $('#boardTitleCount').text(150 - $(this).val().length);
    });

    // tag remove
    $(document).on('click', '.tagList ul li span', function(e){
      var $this = $(this).parent();
      $this.fadeOut('fast', function(){
        $this.remove();
        tag_list.splice(tag_list.indexOf($this.data('id')), 1);
      });
    });

    // tag add modal
    $('#addTagModal').on('shown.bs.modal', function(e){
      var modal = $(this);
      var tag = modal.find('.modal-body select[name=tag]');
      util.get('/tag/',
        function(data){
          data = $.map(data.tags, function(item){
            return {
              id: item.tag,
              text: item.tag
            }
          }
        );
        tag.select2({
          placeholder: 'Enter or search tag',
          multiple: true,
          tags: true,
          data: data,
          minimumInputLength: 1
        });
      });
      modal.find('.modal-footer button:eq(1)').off('click').on('click', function(e){
        e.preventDefault();
        var tagArray = tag.val();
        if(tagArray.length > 0){
          for(var i = 0; i < tagArray.length; i++){
            var item = tagArray[i];
            (function(item){
              util.post('/tag/add/', {tag: item},
                function(data)
                {
                  if(tag_list.indexOf(data.pk) === -1){
                    tag_list.push(data.pk);
                    $('.tagList ul').append(`<li data-id="${data.pk}">${item} <span>x</span></li>`);
                  }
                }
              );
            })(item);
          }
        }
        $('#addTagModal').modal('hide');
        tag.select2('val', '');
      });
    });

    // save board
    $('a.addBoardBtn').on('click', function(e)
    {
      e.preventDefault();
      // trigger html5 validation
      if(!$('form.addBoardForm')[0].checkValidity()){
        $('form.addBoardForm button[type=submit]').trigger('click');
        return;
      }
      var dataObject = $('form.addBoardForm').serializeObject();
      if(cover_img){
        dataObject.cover_img = cover_img;
      }
      if(tag_list){
        dataObject.tags = tag_list;
      }
      dataObject.activities = actList.getIdList();
      if(pk){
        util.put('/lb/'+pk+'/', dataObject,
          function(res)
          {
            alert('Board saved');
          }
        );
      }else{
        dataObject.author = user.getId();
        console.log(dataObject);
        util.post('/lb/', dataObject,
          function(res)
          {
            console.log(res);
            location.href = 'board_edit.html?' + res.data.learningboard.id;
          }
        );
      }
    })

    // delete board
    $('a.deleteBoardBtn').on('click', function(e)
    {
      e.preventDefault();
      if(!pk) return false;
      var r = confirm('Are you sure to delete the board?');
      if(r){
        util.delete('/lb/'+pk+'/',
          function(data)
          {
            alert('Board deleted');
            location.href = 'boards.html';
          }
        );
      }
    })

    // publish board
    $('a.publishBoardBtn').on('click', function(e)
    {
      e.preventDefault();
      if(!pk) return false;
      util.post('/lb/publish/'+pk+'/', {publish: true},
        function(data)
        {
          $('.publishBoardBtn').parent().addClass('hidden');
          $('.unpublishBoardBtn').parent().removeClass('hidden');
          alert('Board published');
        }
      );
    })

    // unpublish board
    $('a.unpublishBoardBtn').on('click', function(e)
    {
      e.preventDefault();
      if(!pk) return false;
      util.post('/lb/publish/'+pk+'/', {publish: false},
        function(data)
        {
          $('.publishBoardBtn').parent().removeClass('hidden');
          $('.unpublishBoardBtn').parent().addClass('hidden');
          alert('Board unpublished');
        }
      );
    })

    // preview board
    $('a.previewBoardBtn').on('click', function(e)
    {
      e.preventDefault();
      if(!pk) return false;
      window.open('board_preview.html?' + pk,'_blank');
    });

    // add activity collapse
    $('#collapseAddActivity').on('show.bs.collapse', function(e){
      $('#addActivityBox .panel-title a').text('- Add/Edit Learning Activity');
    });

    $('#collapseAddActivity').on('hide.bs.collapse', function(e){
      $('#addActivityBox .panel-title a').text('+ Add/Edit Learning Activity');
    });

    // add activity submit button
    $(document).on('click', 'button.addActivityBtn', function(e){
      // trigger html5 validation
      if($(this).parents('form.addActivityForm')[0].checkValidity()){
        e.preventDefault();
      }else{
        return;
      }
      var $this = $(this);
      console.log(actFormTemp);

      var dataObject = actFormTemp[$("#activityTab li.active").data("type")].serializeObject();
      console.log(dataObject);
      if(dataObject.id){ // edit existing activity
        console.log(actList);
        dataObject.order = actList.indexOf({id: dataObject.id});
        util.put('/activity/'+dataObject.id+'/', dataObject,
          function(res)
          {
            var act = res.data.activity;
            // clear form data
            actFormTemp[act.type].reset();

            var prevDom = $('.activityList .activity [data-id='+act.id+']').parents('.activity');
            var index = $('.activityList .activity').index(prevDom);

            actList.updateElementAt(new ActivityTemplate(act, index), index);

            $this.parent()
            .find('.result_msg')
            .text('Activity edited!')
            .delay(1000)
            .fadeOut('fast', function(){
              $(this).text('');
            });
          }
        );
      }else{ // add new activity
        console.log("new");
        dataObject.order = actList.length+1;
        console.log(actList.length);
        dataObject.author = user.getId();
        dataObject.learningboard = pk;
        console.log(dataObject);
        util.post('/activity/', dataObject,
          function(res)
          {
            console.log(res);
            var act = res.data.activity;
            // clear form data
            actFormTemp[act.type].reset();

            index = actList.length;

            actList.addElement(new ActivityTemplate(act, index));
            $this.parent().find('.result_msg').text('Activity edited!').delay(1000).fadeOut('fast', function(){
              $(this).text('');
            });
          }
        );
      }
    });
    /*
    */
    // edit activity
    $(document).on('click', '.activity span.glyphicon-pencil', function(e){
      var $this = $(this).parents('div.activity');
      var id = $(this).parents('div.control').data('id');
      util.get('/activity/'+id+'/',
        function(res)
        {
          var data = res.data.activity;
          $('#collapseAddActivity').collapse('show');
          $('#activityTab a[href="#'+data.type+'"]').tab('show');
          var targetForm = $('#collapseAddActivity #' + data.type);
          targetForm.find('.addActivityForm input[name=id]').val(data.id);
          targetForm.find('input[name=title]').val(data.title);
          targetForm.find('textarea[name=description]').val(data.description);
          CKEDITOR.instances[targetForm.find('textarea[name=description]').attr('id')].setData(data.description);
          for(var key in data.data){
            targetForm.find('[name="'+key+'"]').val(data.data[key]);
          }
          $('html, body')
          .animate({ scrollTop: $('#addActivityBox').offset().top }, 500);
        }
      );
    });

    // remove activity
    $(document).on('click', '.activity span.glyphicon-remove', function(e){
      var $this = $(this).parents('div.activity');
      var r = confirm('Are you sure to delete this activity?');
      if(!r) return;
      var id = $(this).parents('div.control').data('id');
      util.delete(
        '/activity/'+id+'/',
        function(data)
        {
          actList.removeElementBy({id: id}, {fadeOut: true});
        }
      );
    });
  });

  function initCoverImage(url){
    var instance = $('.uploadImage').fileinput({
      overwriteInitial: true,
      showClose: false,
      showCaption: false,
      showBrowse: false,
      browseOnZoneClick: true,
      removeLabel: 'Remove cover image',
      removeClass: 'btn btn-default btn-block btn-xs',
      defaultPreviewContent: `<img src="${url}" alt="Your Avatar" class="img-responsive">
      <h6 class="text-muted text-center">Click to select cover image</h6>`,
      layoutTemplates: {main2: '{preview} {remove}'},
      allowedFileExtensions: ['jpg', 'png', 'gif']
    });
    (function(instance){
      instance.off('fileloaded').on('fileloaded', function(e, file, previewId, index, reader){
        cover_img = reader.result;
      });
      instance.off('filecleared').on('filecleared', function(e){
        instance.fileinput('destroy');
        initCoverImage('https://placehold.it/300x200');
        cover_img = undefined;
      });
    })(instance);
  }

});

define(['util', 'mdls/User', 'mdls/Activity', 'temps/ActivityTemplate', 'temps/SortableListTemplate', 'temps/ActivityListTemplate', 'temps/ActivityTabTemplate', 'temps/ActivityEditControl', 'lib/ViewDispatcher', 'jquery_ui', 'fileinput', 'select2'], function (util, user, Activity, ActivityTemplate, SortableListTemplate, ActivityListTemplate, ActivityTabTemplate, ActivityEditControl, ViewDispatcher, ui, fi) {

  var scope = {
    pk: undefined,
    cover_img: undefined,
    tag_list: [],
    actList: undefined,
    actFormTemp: {}
  };

  var afterCreateActivityCallback = function(act) {
    var index = scope.actList.length;
    console.log(act);
    var act_t = new ActivityTemplate(act, index);
    var act_c = new ActivityEditControl(act_t);
    act_c.register(scope.actList);
    act_t.addControl(act_c);
    scope.actList.addElement(act_t);
    $('#collapseAddActivity').collapse('hide');
  };
  var afterEditActivityCallback = function(act) {
    console.log(act);
    var index = scope.actList.getIdList().indexOf(act.id);
    scope.actList.updateElementAt(new Activity(act), index);
    $('#collapseAddActivity').collapse('hide');
  };

  $.getCSS('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css');

  $(function(){
    // load category data
    var actTempList = [];
    util.get('/category/',
      function(res)
      {
        var data = res.data;
        $('select[name=category]').append(`<option value=""></option>`);
        for(var i = 0; i < data.category.length; i++){
          $('select[name=category]')
          .append(`
            <option value="${data.category[i].id}">
              ${data.category[i].category}
            </option>`
          );
        }
      }
    );

    // reset data for new board
    if(location.search.includes('?new')){
      window.onbeforeunload = util.saveRemindBeforeUnload;
      $("div[class=curated_by] span").text(user.getInfo().username);

      $('.navbar-nav li:not(:first) a').css({
        color: '#CCC',
        cursor: 'not-allowed'
      });

      initCoverImage();

      scope.actList = new SortableListTemplate(new ActivityListTemplate(), false);
      scope.actList.display($(".activityListContainer"));
    }
    else if(/\?\d+/.test(location.search)){ // assign value to field when editing the board
      scope.pk = location.search.replace('?', '');
      util.get('/lb/'+scope.pk+'/',
        function(res){
          // get the info of the board with pk
          var board = res.data.lb;
          if(board.publish == 1){
            $('.publishBoardBtn').parent().addClass('hidden');
            $('.unpublishBoardBtn').parent().removeClass('hidden');
          }
          if (board.coverImage) {
            scope.cover_img = board.coverImage;
          }
          if(board.tags){
            board.tags.map(function(item){
              scope.tag_list.push(item.id);
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
          $('form.addBoardForm input[name=visibility][value='+board.visibility+']')
          .prop('checked', true);
          if(board.activities && board.activities.length > 0){
            $('.activityListContainer .noActivity').hide();
            var activities = board.activities;
            var length = activities.length;
            var actTemps = activities.map(
              function(activity, index) {
                return new ActivityTemplate(activity, index);
              }
            );
            scope.actList = new SortableListTemplate(new ActivityListTemplate(actTemps), false);
            var len = actTemps.length, ele;
            for (var ii = 0; ii < len; ++ii)
            {
              ele = actTemps[ii];
              var act_c = new ActivityEditControl(ele);
              act_c.register(scope.actList);
              if (ele.addControl) ele.addControl(act_c);
            }
            scope.actList.display($(".activityListContainer"));
          }
          else
          {
            scope.actList = new SortableListTemplate(new ActivityListTemplate(), false);
            scope.actList.display($(".activityListContainer"));
          }
          $('.navbar-nav li:not(:first) a').css({});
          initCoverImage(board.coverImage ? util.urls.media_addr + '/' + board.coverImage: '');
        },
        function(xhr){
          if (xhr.status === 404) util.err404();
          if (xhr.status === 403) util.err403();
        }
      );
    }
    else{
      util.err404();
    }
    $(".btn.sortLockMode").on("click", function() {
      scope.actList.toggleSortingEnabled();
      if (scope.actList.sortingEnabled) {$(this).html("Sorting Enabled");}
      else {$(this).html("Sorting Disabled");}
    })

    // render add/edit activity form
    var actTypes = ViewDispatcher.activities.getTypes();
    var actFormPromise = actTypes.reduce(function(array, act){
      var promise = new Promise(function(resolve, reject) {
        ViewDispatcher.activities.getCreateFormView(act).then(function(form) {
          if (!form) return resolve();
          if (scope.pk) {
            form.setLBId(scope.pk);
          }
          form.setAfterCreate(afterCreateActivityCallback);
          form.setAfterEdit(afterEditActivityCallback);
          form.display($('.activityForm'));
          scope.actFormTemp[form.type] = form;
          resolve(form);
        }).catch(function(err) {
          resolve();
        });
      });
      array.push(promise);
      return array;
    }, []);
    Promise.all(actFormPromise).then(function(result) {
      result.forEach(function(form) {
        if (form) {
          var tab = new ActivityTabTemplate(form);
          tab.display($('#activityTab'));
        }
      });
    }).catch(function(e){
      throw e;
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
        scope.tag_list.splice(scope.tag_list.indexOf($this.data('id')), 1);
      });
    });

    // tag add modal
    $('#addTagModal').on('shown.bs.modal', function(e){
      var modal = $(this);
      var tag = modal.find('.modal-body select[name=tag]');
      util.get('/tag/',
        function(data){
          data = data.data.tag.map(function(item){
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
              util.post('/tag', {tag: item},
                function(data)
                {
                  var id = data.data.tag.id;
                  if(scope.tag_list.indexOf(id) === -1){
                    scope.tag_list.push(id);
                    $('.tagList ul').append(`<li data-id="${id}">${item} <span>x</span></li>`);
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
      if (scope.cover_img) {
        dataObject.coverImage = scope.cover_img;
      } else {
        dataObject.coverImage = null;
      }
      if(scope.tag_list){
        dataObject.tags = scope.tag_list;
      }
      dataObject.activities = scope.actList.getIdList();
      if(scope.pk){
        util.put('/lb/'+scope.pk+'/', dataObject,
          function(res)
          {
            alert('Board saved');
            window.onbeforeunload = null;
          }
        );
      }else{
        dataObject.author = user.getId();
        console.log(dataObject);
        util.post('/lb/', dataObject,
          function(res)
          {
            window.onbeforeunload = null;
            console.log(res);
            location.href = 'board_edit.html?' + res.data.lb.id;
          }
        );
      }
    })

    // delete board
    $('a.deleteBoardBtn').on('click', function(e)
    {
      e.preventDefault();
      if(!scope.pk) return false;
      var r = confirm('Are you sure to delete the board?');
      if(r){
        util.delete('/lb/'+scope.pk+'/',
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
      if(!scope.pk) return false;
      util.post('/lb/publish/'+scope.pk+'/', {publish: true},
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
      if(!scope.pk) return false;
      util.post('/lb/publish/'+scope.pk+'/', {publish: false},
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
      if(!scope.pk) return false;
      window.open('board_preview.html?' + scope.pk,'_blank');
    });

    // add activity collapse
    $('#collapseAddActivity').on('show.bs.collapse', function(e){
      $('#addActivityBox .panel-title a').text('- Add/Edit Learning Activity');
    });

    $('#collapseAddActivity').on('hide.bs.collapse', function(e){
      $('#addActivityBox .panel-title a').text('+ Add/Edit Learning Activity');
    });

    // edit activity
    $(document).on('click', '.activity span.glyphicon-pencil', function(e){
      var id = $(this).parents('div.control').data('id');
      util.get('/activity/'+id+'/',
        function(res)
        {
          var data = res.data.activity;
          $('#collapseAddActivity').collapse('show');
          $('#activityTab a[href="#'+data.type+'"]').tab('show');
          scope.actFormTemp[data.type].setData(data);
          $('html, body')
          .animate({ scrollTop: $('#addActivityBox').offset().top }, 500);
        }
      );
    });

    $("input, textarea, select").on("change", function() {
      window.onbeforeunload = util.saveRemindBeforeUnload;
    });

  });

  function initCoverImage(url){
    if (!url) url = 'img/placeholder-300x225.png';
    var instance = $('.uploadImage').fileinput('destroy').fileinput({
      overwriteInitial: true,
      showClose: false,
      showCaption: false,
      showBrowse: false,
      browseOnZoneClick: true,
      removeLabel: 'Remove cover image',
      removeClass: 'btn btn-default btn-block btn-xs',
      defaultPreviewContent: `<img src="${url}" alt="Cover Image" class="img-responsive">
      <h6 class="text-muted text-center">Click to select cover image</h6>`,
      layoutTemplates: {
        main2: '{preview} {remove}',
        footer: ''
      },
      allowedFileTypes: ['image']
    });
    (function(instance){
      instance.off('fileloaded').on('fileloaded', function(e, file, previewId, index, reader){
        util.post('/media', {data: reader.result}, function(res) {
          scope.cover_img = res.data.file;
        });
      });
      instance.off('filecleared').on('filecleared', function(e){
        initCoverImage();
        scope.cover_img = undefined;
      });
    })(instance);
  }



});

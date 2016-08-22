define(['temps/Template', 'models/Quiz'], function(Template, Quiz) {
  "use strict";

  var QuizTemplate = function(quiz, parentModel) {
    this.parentModel = parentModel;
    this.model = new Quiz(quiz);
    console.log(this.model);
    var link = this.model.quiz_link;

    var $html;

    if (this.model.quiz_platform === "qzzr")
    {
      $html = $(`
        <div class="embed-responsive embed-responsive-16by9">
          <div class="quizz-container" data-width="100%" data-height="auto" data-quiz="${this.model.quiz_id}"></div>
          <script src="https://dcc4iyjchzom0.cloudfront.net/widget/loader.js" async></script>
        </div>
      `);
      console.log(this.model.quiz_id);
    }
    else if (this.model.quiz_platform === "clsmrkr")
    {
      console.log(this.model.quiz_id);
      $html = $(`
        <iframe src="https://www.classmarker.com/online-test/start/?quiz=${this.model.quiz_id}&iframe=1" frameborder="0" style="width:100%;max-width:700px;" height="800"></iframe>
      `);
    }
    else 
    {
      $html = $(`<div>Error happens when displaying this activity</div>`);
    }
    Template.call(this, $html);
  }

  $.extend(QuizTemplate.prototype, Template.prototype)
  return QuizTemplate;
});

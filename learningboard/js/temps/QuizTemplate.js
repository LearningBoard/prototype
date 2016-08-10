define(['temps/Template', 'models/Quiz'], function(Template, Quiz) {
  "use strict";

  var QuizTemplate = function(quiz) {
    this.model = new Quiz(quiz);
    var link = this.model.quiz_link;

    var $html;

    if (link) {
      if (link.match(/qzzr\.com/) != null) {
        var id = link.match(/qzzr\.com\/c\/quiz\/(\d+)/)[1];
        $html = $(`
          <div class="embed-responsive embed-responsive-16by9">
            <div class="quizz-container" data-width="100%" data-height="auto" data-quiz="${id}"></div>
            <script src="https://dcc4iyjchzom0.cloudfront.net/widget/loader.js" async></script>
          </div>
        `);
      }
    }

    Template.call(this, $html);
  }

  $.extend(QuizTemplate.prototype, Template.prototype)
  return QuizTemplate;
});

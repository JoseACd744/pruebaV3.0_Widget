define(['jquery', 'lib/components/base/modal'], function ($, Modal) {
  var CustomWidget = function () {
      var self = this;

      this.callbacks = {
          render: function () {
              self.renderTemplate();
              return true;
          },
          init: function () {
              $('#calculate_button').click(function () {
                  self.calculateBudget();
              });
              return true;
          },
          bind_actions: function () {
              return true;
          }
      };

      this.renderTemplate = function () {
          self.render_template({
              caption: {
                  class_name: 'widget-caption',
                  html: ''
              },
              body: '',
              render: '\
                <div id="widget_container" class="widget-container">\
                  <button id="calculate_button">{{ i18n.settings.button_text }}</button>\
                  <div id="budget_result" class="budget-result"></div>\
                </div>\
                <style>\
                  .widget-container { padding: 10px; }\
                  #calculate_button { color: #fff; background-color: #007bff; border-color: #007bff; padding: 0.375rem 0.75rem; border-radius: 0.25rem; border: 1px solid transparent; cursor: pointer; }\
                  #budget_result { margin-top: 10px; padding: 10px; background-color: #f8f9fa; border: 1px solid #ccc; border-radius: 0.25rem; }\
                </style>'
          });
      };

      this.calculateBudget = function () {
          var users = self.system().custom_fields.users || 0;
          var months = self.system().custom_fields.months || 0;
          var plan = self.system().custom_fields.plan_kommo || 'Básico';
          var planValue = plan === 'Avanzado' ? 15 : plan === 'Empresarial' ? 30 : 10;
          var budget = users * months * planValue;
          $('#budget_result').html('Presupuesto Calculado: ' + budget);
      };

      return this;
  };

  return CustomWidget;
});

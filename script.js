define(['jquery'], function($) {
  var CustomWidget = function() {
    var self = this;

    this.callbacks = {
      settings: function() {},
      init: function() {
        return true;
      },
      bind_actions: function() {
        if (APP.isCard()) {
          $('#log-lead-data').on('click', function() {
            self.logLeadData();
          });
        }
        return true;
      },
      render: function() {
        self.render_template({
          caption: {
            class_name: 'js-widget-caption',
            html: ''
          },
          body: '',
          render: function() {
            return new Promise(function(resolve) {
              $.get(self.params.path + '/templates/template.twig', function(template) {
                var html = Twig.twig({
                  data: template
                }).render({
                  button_text: self.i18n('button_text')
                });
                resolve(html);
              });
            });
          }
        });
        return true;
      },
      dpSettings: function() {},
      advancedSettings: function() {},
      destroy: function() {}
    };

    this.logLeadData = function() {
      if (APP.data.current_card) {
        var leadData = {
          id: APP.data.current_card.id,
          model: APP.data.current_card.model.toJSON() // Convert the backbone model to JSON
        };
        console.log(leadData);
      } else {
        console.log("No lead data available");
      }
    };

    return this;
  };

  return CustomWidget;
});

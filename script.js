define(['jquery'], function ($) {
  var CustomWidget = function () {
    var self = this;

    this.callbacks = {
      render: function () {
        return true;
      },
      init: function () {
        return true;
      },
      bind_actions: function () {
        return true;
      },
      settings: function () {
        return true;
      },
      onSave: function () {
        return true;
      },
      advancedSettings: function ($modal_body) {
        // Fetch settings and localization
        var settings = self.get_settings();
        var i18n = self.i18n('settings');

        // HTML for the advanced settings form, using localization
        var template = `
          <div class="widget_settings_block">
            <div class="widget_settings_block__item">
              <div class="widget_settings_block__title">${i18n.webhook_url}</div>
              <input type="text" class="widget_settings_block__input" name="webhook_url" value="${settings.webhook_url || ''}">
            </div>
            <div class="widget_settings_block__item">
              <div class="widget_settings_block__title">${i18n.custom_field1}</div>
              <input type="text" class="widget_settings_block__input" name="custom_field1" value="${settings.custom_field1 || ''}">
            </div>
            <div class="widget_settings_block__item">
              <div class="widget_settings_block__title">${i18n.custom_field2}</div>
              <input type="text" class="widget_settings_block__input" name="custom_field2" value="${settings.custom_field2 || ''}">
            </div>
            <div class="widget_settings_block__item">
              <button class="button-input_blue button-input_save js-widget-save">${i18n.button_title}</button>
            </div>
          </div>
        `;

        $modal_body.html(template);

        $modal_body.find('.js-widget-save').on('click', function () {
          var newSettings = {
            webhook_url: $modal_body.find('input[name="webhook_url"]').val(),
            custom_field1: $modal_body.find('input[name="custom_field1"]').val(),
            custom_field2: $modal_body.find('input[name="custom_field2"]').val()
          };
          self.save_settings(newSettings);
        });

        return true;
      }
    };

    return this;
  };

  return CustomWidget;
});

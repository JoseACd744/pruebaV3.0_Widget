define(['jquery'], function ($) {
  var CustomWidget = function () {
    var self = this;

    this.callbacks = {
      render: function () {
        return true;
      },
      init: function () {
        // Load custom CSS
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = self.params.path + '/style.css'; // Ensure the correct path to style.css
        document.head.appendChild(link);

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
      salesbotDesignerSave: function (handler_code) {
        var settings = self.get_settings();
        var name = settings.name;
        var webhookUrl = settings.webhook_url;
        var requestBody = {};

        $('.request_body__item').each(function () {
          var key = $(this).find('.request_body__key').val();
          var value = $(this).find('.request_body__value').val();
          if (key) {
            requestBody[key] = value;
          }
        });

        var data = {
          name: name,
          requestBody: requestBody
        };

        if (webhookUrl) {
          // Automatically trigger webhook after saving settings
          $.ajax({
            type: "POST",
            url: webhookUrl,
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (response) {
              console.log("Webhook executed successfully:", response);
            },
            error: function (error) {
              console.error("Error executing webhook:", error);
            }
          });
        }

        return handler_code; // Ensure to return the handler_code for proper saving
      },
      salesbotDesignerSettings: function ($modal_body) {
        var settings = self.get_settings();
        var i18n = self.i18n('settings');

        var template = `
          <div class="widget_settings_block">
            <div class="widget_settings_block__item">
              <div class="widget_settings_block__title">${i18n.name}</div>
              <input type="text" class="widget_settings_block__input" name="name" value="${settings.name || ''}" placeholder="${i18n.name}">
            </div>
            <div class="widget_settings_block__item">
              <div class="widget_settings_block__title">${i18n.webhook_url}</div>
              <input type="text" class="widget_settings_block__input" name="webhook_url" value="${settings.webhook_url || ''}">
            </div>
            <div class="widget_settings_block__item">
              <div class="widget_settings_block__title">${i18n.requestBody}</div>
              <div class="request_body">
                ${self.getDynamicFields(settings.requestBody)}
              </div>
              <button type="button" class="add_field_button">${i18n.add_field_button}</button>
            </div>
          </div>
        `;

        $modal_body.html(template);

        // Add dynamic field functionality
        $modal_body.on('click', '.add_field_button', function () {
          var newField = `
            <div class="request_body__item">
              <input type="text" class="request_body__key" placeholder="${i18n.key}">
              <input type="text" class="request_body__value" placeholder="${i18n.value}">
              <button type="button" class="remove_field">${i18n.remove_field}</button>
            </div>
          `;
          $modal_body.find('.request_body').append(newField);
        });

        $modal_body.on('click', '.remove_field', function () {
          $(this).closest('.request_body__item').remove();
        });

        // Save settings and trigger webhook
        $modal_body.find('.js-widget-save').on('click', function () {
          var newSettings = {
            name: $modal_body.find('input[name="name"]').val(),
            webhook_url: $modal_body.find('input[name="webhook_url"]').val(),
            requestBody: {}
          };

          $modal_body.find('.request_body__item').each(function () {
            var key = $(this).find('.request_body__key').val();
            var value = $(this).find('.request_body__value').val();
            if (key) {
              newSettings.requestBody[key] = value;
            }
          });

          self.save_settings(newSettings);

          if (newSettings.webhook_url) {
            // Automatically trigger webhook after saving settings
            $.ajax({
              type: "POST",
              url: newSettings.webhook_url,
              data: JSON.stringify(newSettings.requestBody),
              contentType: "application/json",
              success: function (response) {
                console.log("Webhook executed successfully:", response);
              },
              error: function (error) {
                console.error("Error executing webhook:", error);
              }
            });
          }
        });

        return true;
      }
    };

    // Function to get dynamic fields
    self.getDynamicFields = function (requestBody) {
      var fieldsHtml = '';
      if (requestBody) {
        for (var key in requestBody) {
          if (requestBody.hasOwnProperty(key)) {
            fieldsHtml += `
              <div class="request_body__item">
                <input type="text" class="request_body__key" value="${key}" placeholder="${self.i18n('settings').key}">
                <input type="text" class="request_body__value" value="${requestBody[key]}" placeholder="${self.i18n('settings').value}">
                <button type="button" class="remove_field">${self.i18n('settings').remove_field}</button>
              </div>
            `;
          }
        }
      }
      return fieldsHtml;
    };

    return this;
  };

  return CustomWidget;
});

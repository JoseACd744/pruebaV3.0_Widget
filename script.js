define(['jquery'], function ($) {
  var CustomWidget = function () {
    var self = this;

    this.callbacks = {
      settings: function () {
        return true;
      },
      init: function () {
        self.loadCSS();
        return true;
      },
      bind_actions: function () {
        $(document).on('click', '#calculate-btn', function () {
          self.calculate();
        });
        $(document).on('click', '#send-webhook-btn', function () {
          self.sendWebhook();
        });
        return true;
      },
      render: function () {
        self.render_template({
          caption: {
            class_name: 'js-km-caption',
            html: 'Lead Data Calculator'
          },
          body: '<div class="km-form">\
                   <label for="webhook-url">Webhook URL:</label>\
                   <input type="text" id="webhook-url" placeholder="Enter Webhook URL"/>\
                   <button id="calculate-btn">Calculate</button>\
                   <button id="send-webhook-btn">Send to Webhook</button>\
                   <div id="calculation-result"></div>\
                 </div>',
          render: ''
        });
        return true;
      },
      onSave: function () {
        return true;
      },
      leads: {
        selected: function () {
          return true;
        }
      },
      destroy: function () {}
    };

    this.loadCSS = function() {
      var settings = self.get_settings();
      if ($('link[href="' + settings.path + '/style.css?v=' + settings.version + '"').length < 1) {
        $('head').append('<link href="' + settings.path + '/style.css?v=' + settings.version + '" type="text/css" rel="stylesheet">');
      }
    };

    this.calculate = function () {
      var leadData = APP.data.current_card;
      var attributes = leadData.fields_hider.model.attributes;

      if (leadData && attributes) {
        var meses = parseInt(attributes['CFV[2959884]'] || '0', 10);
        var usuarios = parseInt(attributes['CFV[2959886]'] || '0', 10);
        var planKommo = attributes['CFV[2959888]'] || '';

        console.log('Meses:', meses);
        console.log('Usuarios:', usuarios);
        console.log('Plan Kommo:', planKommo);  

        var planValue;
        switch (planKommo) {
          case "9227454": // Básico
            planValue = 10;
            break;
          case "9227456": // Avanzado
            planValue = 15;
            break;
          case "9227458": // Empresarial
            planValue = 30;
            break;
          default:
            console.log('Unexpected planKommo value:', planKommo);
            planValue = 0;
        }

        console.log('Plan Value:', planValue);

        var result = meses * usuarios * planValue;

        // Guardar el resultado en una variable para usarlo en el webhook
        self.calculationResult = result;

        // Mostrar el resultado en la pantalla
        var displayDiv = $('#calculation-result');
        displayDiv.empty();
        displayDiv.append('<p>Calculation Result: ' + result + '</p>');
      } else {
        console.error('Lead data or attributes are undefined');
      }
    };

    this.sendWebhook = function() {
      var webhookUrl = $('#webhook-url').val();
      if (!webhookUrl) {
        alert('Please enter a valid Webhook URL');
        return;
      }

      var payload = {
        id: APP.data.current_card.id,
        price: self.calculationResult
      };

      // Enviar el webhook usando $.ajax
      $.ajax({
        url: webhookUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function(response) {
          console.log('Webhook sent successfully:', response);
        },
        error: function(xhr, status, error) {
          console.error('Error sending webhook:', error);
        }
      });
    };

    return this;
  };
  return CustomWidget;
});

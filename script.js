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
        $('#calculate-btn').on('click', function () {
          self.calculate();
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
                   <button id="calculate-btn">Calculate</button>\
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

        var displayDiv = $('#calculation-result');
        displayDiv.empty();
        displayDiv.append('<p>Calculation Result: ' + result + '</p>');
      } else {
        console.error('Lead data or attributes are undefined');
      }
    };

    return this;
  };
  return CustomWidget;
});

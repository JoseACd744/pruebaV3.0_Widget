define(['jquery'], function ($) {
  var CustomWidget = function () {
    var self = this;

    this.callbacks = {
      settings: function () {
        return true;
      },
      init: function () {
        return true;
      },
      bind_actions: function () {
        $('#fetch-lead-data-btn').on('click', function () {
          self.fetchLeadData();
        });
        return true;
      },
      render: function () {
        self.render_template({
          caption: {
            class_name: 'js-km-caption',
            html: 'Lead Data Fetcher'
          },
          body: '<div class="km-form">\
                   <button id="fetch-lead-data-btn">Fetch Lead Data</button>\
                   <div id="lead-data-display"></div>\
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

    this.fetchLeadData = function () {
      var leadData = APP.data.current_card;
      var displayDiv = $('#lead-data-display');
      displayDiv.empty();
      displayDiv.append('<p>Lead ID: ' + leadData.id + '</p>');
      displayDiv.append('<p>Attributes: ' + JSON.stringify(leadData.attributes) + '</p>');
    };

    return this;
  };
  return CustomWidget;
});

/*
 *
 */

Ext.onReady(function(){
    Ext.QuickTips.init();

    // Menus can be prebuilt and passed by reference

    var monthMenu1 = new Ext.ux.MonthMenu({
        handler : function(dp, newValue, oldValue){
          // Ext.Msg.alert('Date Selected', 'You have choosen {0}.', newValue.format('M j, Y'));
            Ext.getCmp('select-year-month').setText(newValue.getFullYear()+'-'+String.leftPad(newValue.getMonth() + 1, 2, '0'));

            /*
             * When the user has selected a different month than the current -
             * do something e.g. reload a grid.
             */
            if (isNaN(oldValue) || Ext.isEmpty(oldValue) || newValue.getLastDateOfMonth().getElapsed() != oldValue.getLastDateOfMonth().getElapsed()) {
                (function() {
                   ((isNaN(oldValue) || Ext.isEmpty(oldValue)) ? '' : oldValue.format('M j, Y')), newValue.format('M j, Y');
                }).defer(100);
               
            }
        },
        format: 'Y-m',
        id: 'year-month-menu1',
        allowBlank: false,
        useDayDate: 1,
        noPastYears: false,
        noPastMonths: false
    });
    
    var monthMenu2 = new Ext.ux.MonthMenu({
        handler : function(dp, newValue, oldValue){
            newValue.format('M j, Y');
            Ext.getCmp('select-year-month-restricted').setText(newValue.getFullYear()+'-'+String.leftPad(newValue.getMonth() + 1, 2, '0'));

            /*
             * When the user has selected a different month than the current -
             * do something e.g. reload a grid.
             */
            if (isNaN(oldValue) || Ext.isEmpty(oldValue) || newValue.getLastDateOfMonth().getElapsed() != oldValue.getLastDateOfMonth().getElapsed()) {
                (function() {
                    ((isNaN(oldValue) || Ext.isEmpty(oldValue)) ? '' : oldValue.format('M j, Y')), newValue.format('M j, Y');
                }).defer(100);
               
            }
        },
        format: 'Y-m',
        id: 'year-month-menu2',
        allowBlank: false,
        useDayDate: 1,
        noPastYears: false,
        noPastMonths: false,
        minDate: new Date('2000/9/1'),
        maxDate: new Date('2022/8/1')
    });

    var tb = new Ext.Toolbar();
    tb.render('toolbar');

    tb.add({
        xtype: 'button',
        text: '- 选择年月 -',
        id: 'select-year-month',
        menu: monthMenu1,
        tooltip: '点击可选择年月',
        listeners: {
            menushow: function(e, menu) {
                /*
                 * We want to reflect the currently displayed date in the picker.
                 * So set the value and update the picker UI to preselect the shown date.
                 */
                this.menu.picker.setValue(new Date(Date.parse((this.getText()+'-01').replace(/-/g, '/'))));
                this.menu.picker.updateMonthPicker();
            }
        }
    }, {
        xtype: 'numberfield',
        id: 'default-year-field',
        width: 50,
        minLength: 4,
        maxLength: 4,
        value: new Date().getFullYear()
    }, {
        xtype: 'numberfield',
        id: 'default-month-field',
        width: 30,
        minLength: 1,
        maxLength: 2,
        minValue: 1,
        maxValue: 12,
        value: new Date().getMonth()
    }, {
        xtype: 'button',
        text: '设置日期',
        id: 'set-default-date',
        tooltip: 'Set a default date from outside the component (e.g. on page load, grid load, ...)',
        listeners: {
            click: function(e) {
                var month = Ext.num(Ext.getCmp('default-month-field').getValue(), new Date().getMonth());
                var year = Ext.num(Ext.getCmp('default-year-field').getValue(), new Date().getYear());
                
                Ext.getCmp('select-year-month').setText(year+'-'+String.leftPad(month, 2, '0'));
            }
        }
    }, '-',
    {
        xtype: 'button',
        text: '- Choose -',
        id: 'select-year-month-restricted',
        menu: monthMenu2,
        tooltip: 'Choose a second Date',
        listeners: {
            menushow: function(e, menu) {
                /*
                 * We want to reflect the currently displayed date in the picker.
                 * So set the value and update the picker UI to preselect the shown date.
                 */
                this.menu.picker.setValue(new Date(Date.parse((this.getText()+'-01').replace(/-/g, '/'))));
                this.menu.picker.updateMonthPicker();
            }
        }
    });
});
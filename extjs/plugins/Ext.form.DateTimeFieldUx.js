/**
 * 日期时间输入框，实则是由日期输入框+时间输入框组成。
 * 
 * @class Ext.form.DateTimeFieldUx
 * @extends Ext.form.Field
 * @author fbchen 陈富冰
 * @version 1.0 2011-07-21 需要引用相关的文件：
 * 
 * <pre>
 *   
 * &lt;script type=&quot;text/javascript&quot; src=&quot;&lt;%=request.getContextPath()%&gt;/ext/ux/Ext.form.DateTimeFieldUx.js&quot;&gt;&lt;/script&gt;  
 * </pre>
 */
Ext.form.DateTimeFieldUx = Ext.extend(Ext.form.Field, {
	datetimeFormat : '{date} {time}',
	dateFormat : 'Y-m-d',
	timeFormat : 'H:i:s',

	dataField : null,
	timeField : null,

	// private
	initComponent : function() {
		Ext.form.DateTimeFieldUx.superclass.initComponent.call(this);

		this.defaultProps = ['allowBlank', 'blankText', 'disabled', 'readOnly',
				'disabledClass', 'emptyClass', 'emptyText', 'fieldClass',
				'focusClass', 'invalidClass', 'overCls'];

		this.fieldTpl = new Ext.Template(
				'<table border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed"><tbody><tr>',
				'<td nowarp="" width="50%" class="ux-dt-field"></td>',
				'<td nowarp="" width="50%" class="ux-dt-field"></td>',
				'</tr></tbody></table>');

		this.dataField = this.dataField || {};
		this.timeField = this.timeField || {};
		if (this.dateFormat != null) {
			this.dataField.format = this.dateFormat;
		}
		if (this.timeFormat != null) {
			this.timeField.format = this.timeFormat;
		}
		this.applyDefaults(this.dataField, this.defaultProps);
		this.applyDefaults(this.timeField, this.defaultProps);

		Ext.apply(this.dataField, {
					hideLabel : true,
					anchor : '100%',
					value : this.dataValue
				});
		Ext.apply(this.timeField, {
					hideLabel : true,
					anchor : '100%',
					increment : 60,
					value : this.timeValue
				});
	},

	// private
	onRender : function(ct, position) {
		Ext.form.DateTimeFieldUx.superclass.onRender.call(this, ct, position);
		this.el.addClass('x-hidden');
		this.wrap = this.el.wrap({
					cls : "x-form-field-wrap"
				});

		this.tb = this.fieldTpl.append(this.wrap, {}, true);
		this.td1 = this.tb.child('TD.ux-dt-field:nth(1)');
		this.td2 = this.tb.child('TD.ux-dt-field:nth(2)');

		var w = this.wrap.getWidth();
		this.tb.setWidth(w);
		this.datefield = new Ext.form.DateField(this.dataField)
				.render(this.td1);
		this.timefield = new Ext.form.TimeField(this.timeField)
				.render(this.td2);

		// prevent input submission
		this.datefield.el.dom.removeAttribute('name');
		this.timefield.el.dom.removeAttribute('name');

		this.datefield.afterMethod('setValue', this.updateValue, this);
		this.timefield.afterMethod('setValue', this.updateValue, this);
	},

	/**
	 * 设置默认值
	 * 
	 * @param {Object}
	 *            target
	 * @param {Array}
	 *            props
	 */
	applyDefaults : function(target, props) {
		var o = {};
		Ext.each(props, function(p) {
					if (Ext.type(this[p]) != false) {
						o[p] = this[p];
					}
				}, this);
		Ext.apply(target, o);
	},

	// private - Subclasses should provide the validation implementation by
	// overriding this
	validateValue : function(value) {
		if (!Ext.form.DateTimeFieldUx.superclass.validateValue
				.call(this, value)) {
			return false;
		}
		/*
		 * if (value != null) { var format = this.getDateTimeFormat(); if
		 * (!Date.parseDate(value, format)) { this.markInvalid(); return false; } }
		 */
		return true;
	},

	validate : function() {
		if (!this.datefield.validate()) {
			return false;
		}
		if (!this.timefield.validate()) {
			return false;
		}
		return Ext.form.DateTimeFieldUx.superclass.validate.call(this);
	},

	onDestroy : function() {
		if (this.datefield) {
			this.datefield.destroy();
		}
		if (this.timefield) {
			this.timefield.destroy();
		}
		Ext.form.DateTimeFieldUx.superclass.onDestroy.call(this);
	},

	getDateTimeFormat : function() {
		return new Ext.Template(this.datetimeFormat).apply({
					date : this.datefield.format,
					time : this.timefield.format
				});
	},

	getDateTimeValue : function(dateValue, timeValue) {
		return new Ext.Template(this.datetimeFormat).apply({
					date : dateValue || '',
					time : timeValue || ''
				}).trim();
	},

	updateValue : function(field, newValue, oldValue) {
		if (this.isValid()) {
			this.el.dom.value = this.getRawValue();
		}
	},

	initValue : function() {
		Ext.form.DateTimeFieldUx.superclass.initValue.call(this);
		this.originalValue = this.getValue();
	},

	getRawValue : function() {
		var dvalue = this.datefield.rendered
				? this.datefield.getRawValue()
				: '';
		var tvalue = this.timefield.rendered
				? this.timefield.getRawValue()
				: '';
		if (dvalue == '' && tvalue == '') {
			return '';
		}
		return this.getDateTimeValue(dvalue, tvalue);
	},

	/**
	 * Sets the underlying DOM field's value directly, bypassing validation. To
	 * set the value with validation see {@link #setValue}.
	 * 
	 * @param {Mixed}
	 *            value The value to set
	 * @return {Mixed} value The field value that is set
	 */
	setRawValue : function(v) {
		if (v === null || v === undefined) {
			this.datefield.el.dom.value = '';
			this.timefield.el.dom.value = '';
			return this.el.dom.value = '';
		}
		var format = this.getDateTimeFormat();
		var d = Ext.isDate(v) ? v : Date.parseDate(v, format);
		if (d) {
			this.datefield.el.dom.value = d.format(this.datefield.format);
			this.timefield.el.dom.value = d.format(this.timefield.format);
		} else {
			this.datefield.setValue(v);
			this.timefield.setValue(v);
		}
		return this.el.dom.value = (d === null || d === undefined ? v : d
				.format(format));
	},

	/**
	 * Returns the currently selected field value or empty string if no value is
	 * set.
	 * 
	 * @return {String} value The selected value
	 */
	getValue : function() {
		var format = this.getDateTimeFormat();
		if (!this.datefield.rendered) {
			if (this.value != null && this.value != undefined) {
				return Date.parseDate(this.value, format);
			} else {
				var v = this.getDateTimeValue(this.dateValue, this.timeValue);
				return Date.parseDate(v, format);
			}
		}
		var dvalue = this.datefield.getRawValue();
		var tvalue = this.timefield.getRawValue();
		var v = this.getDateTimeValue(dvalue, tvalue);
		return Date.parseDate(v, format);
	},

	setValue : function(value) {
		if (value != null && Ext.isDate(value)) {
			var format = this.getDateTimeFormat();
			value = Date.parseDate(value, format);
		}
		this.setRawValue(value);
	},

	/**
	 * Resets the current field value to the originally-loaded value and clears
	 * any validation messages.
	 */
	reset : function() {
		this.datefield.reset();
		this.timefield.reset();
		Ext.form.DateTimeFieldUx.superclass.reset.call(this);
	},

	// private
	onResize : function(w, h) {
		Ext.form.DateTimeFieldUx.superclass.onResize.call(this, w, h);
		this.wrap.setWidth(w);
		this.tb.setStyle({
					'width' : w
				});
		this.datefield.setWidth(this.td1.getWidth());
		this.timefield.setWidth(this.td2.getWidth());
	}

});
Ext.reg('datetimefield', Ext.form.DateTimeFieldUx);
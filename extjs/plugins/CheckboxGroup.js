/*
 * ! Ext JS Library 3.0.0 Copyright(c) 2006-2009 Ext JS, LLC licensing@extjs.com
 * http://www.extjs.com/license
 */
/**
 * @class Ext.form.CheckboxGroup
 * @extends Ext.form.Field
 *          <p>
 *          A grouping container for {@link Ext.form.Checkbox} controls.
 *          </p>
 *          <p>
 *          Sample usage:
 *          </p>
 * 
 * <pre><code>
 * var myCheckboxGroup = new Ext.form.CheckboxGroup({
 * 			id : 'myGroup',
 * 			xtype : 'checkboxgroup',
 * 			fieldLabel : 'Single Column',
 * 			itemCls : 'x-check-group-alt',
 * 			// Put all controls in a single column with width 100%
 * 			columns : 1,
 * 			items : [{
 * 						boxLabel : 'Item 1',
 * 						name : 'cb-col-1'
 * 					}, {
 * 						boxLabel : 'Item 2',
 * 						name : 'cb-col-2',
 * 						checked : true
 * 					}, {
 * 						boxLabel : 'Item 3',
 * 						name : 'cb-col-3'
 * 					}]
 * 		});
 * </code></pre>
 * 
 * @constructor Creates a new CheckboxGroup
 * @param {Object}
 *            config Configuration options
 * @xtype checkboxgroup
 */
Ext.form.CheckboxGroup = Ext.extend(Ext.form.Field, {
	/**
	 * @cfg {Array} items An Array of {@link Ext.form.Checkbox Checkbox}es or
	 *      Checkbox config objects to arrange in the group.
	 */
	/**
	 * @cfg {String/Number/Array} columns Specifies the number of columns to use
	 *      when displaying grouped checkbox/radio controls using automatic
	 *      layout. This config can take several types of values:
	 *      <ul>
	 *      <li><b>'auto'</b> :
	 *      <p class="sub-desc">
	 *      The controls will be rendered one per column on one row and the
	 *      width of each column will be evenly distributed based on the width
	 *      of the overall field container. This is the default.
	 *      </p>
	 *      </li>
	 *      <li><b>Number</b> :
	 *      <p class="sub-desc">
	 *      If you specific a number (e.g., 3) that number of columns will be
	 *      created and the contained controls will be automatically distributed
	 *      based on the value of {@link #vertical}.
	 *      </p>
	 *      </li>
	 *      <li><b>Array</b> : Object
	 *      <p class="sub-desc">
	 *      You can also specify an array of column widths, mixing integer
	 *      (fixed width) and float (percentage width) values as needed (e.g.,
	 *      [100, .25, .75]). Any integer values will be rendered first, then
	 *      any float values will be calculated as a percentage of the remaining
	 *      space. Float values do not have to add up to 1 (100%) although if
	 *      you want the controls to take up the entire field container you
	 *      should do so.
	 *      </p>
	 *      </li>
	 *      </ul>
	 */
	columns : 'auto',
	/**
	 * @cfg {Boolean} vertical True to distribute contained controls across
	 *      columns, completely filling each column top to bottom before
	 *      starting on the next column. The number of controls in each column
	 *      will be automatically calculated to keep columns as even as
	 *      possible. The default value is false, so that controls will be added
	 *      to columns one at a time, completely filling each row left to right
	 *      before starting on the next row.
	 */
	vertical : false,
	/**
	 * @cfg {Boolean} allowBlank False to validate that at least one item in the
	 *      group is checked (defaults to true). If no items are selected at
	 *      validation time, {@link @blankText} will be used as the error text.
	 */
	allowBlank : true,
	/**
	 * @cfg {String} blankText Error text to display if the {@link #allowBlank}
	 *      validation fails (defaults to "You must select at least one item in
	 *      this group")
	 */
	blankText : "You must select at least one item in this group",

	// private
	defaultType : 'checkbox',

	// private
	groupCls : 'x-form-check-group',

	// private
	initComponent : function() {
		this.addEvents(
				/**
				 * @event change Fires when the state of a child checkbox
				 *        changes.
				 * @param {Ext.form.CheckboxGroup}
				 *            this
				 * @param {Array}
				 *            checked An array containing the checked boxes.
				 */
				'change');
		Ext.form.CheckboxGroup.superclass.initComponent.call(this);
	},
	getName : function() {
		return this.rendered && this.el.dom.name
				? this.el.dom.name
				: (this.name || this.hiddenName || '');
	},
	// private
	onRender : function(ct, position) {
		if (!this.el) {
			var panelCfg = {
				cls : this.groupCls,
				layout : 'column',
				border : false,
				renderTo : ct
			};
			var colCfg = {
				defaultType : this.defaultType,
				layout : 'form',
				border : false,
				defaults : {
					hideLabel : true,
					anchor : '100%'
				}
			};

			if (this.items[0].items) {

				// The container has standard ColumnLayout configs, so pass them
				// in directly

				Ext.apply(panelCfg, {
							layoutConfig : {
								columns : this.items.length
							},
							defaults : this.defaults,
							items : this.items
						});
				for (var i = 0, len = this.items.length; i < len; i++) {
					Ext.applyIf(this.items[i], colCfg);
				}

			} else {

				// The container has field item configs, so we have to generate
				// the column
				// panels first then move the items into the columns as needed.

				var numCols, cols = [];

				if (typeof this.columns == 'string') { // 'auto' so create a
														// col per item
					this.columns = this.items.length;
				}
				if (!Ext.isArray(this.columns)) {
					var cs = [];
					for (var i = 0; i < this.columns; i++) {
						cs.push((100 / this.columns) * .01); // distribute by
																// even %
					}
					this.columns = cs;
				}

				numCols = this.columns.length;

				// Generate the column configs with the correct width setting
				for (var i = 0; i < numCols; i++) {
					var cc = Ext.apply({
								items : []
							}, colCfg);
					cc[this.columns[i] <= 1 ? 'columnWidth' : 'width'] = this.columns[i];
					if (this.defaults) {
						cc.defaults = Ext.apply(cc.defaults || {},
								this.defaults)
					}
					cols.push(cc);
				};

				// Distribute the original items into the columns
				if (this.vertical) {
					var rows = Math.ceil(this.items.length / numCols), ri = 0;
					for (var i = 0, len = this.items.length; i < len; i++) {
						if (i > 0 && i % rows == 0) {
							ri++;
						}
						if (this.items[i].fieldLabel) {
							this.items[i].hideLabel = false;
						}
						cols[ri].items.push(this.items[i]);
					};
				} else {
					for (var i = 0, len = this.items.length; i < len; i++) {
						var ci = i % numCols;
						if (this.items[i].fieldLabel) {
							this.items[i].hideLabel = false;
						}
						cols[ci].items.push(this.items[i]);
					};
				}

				Ext.apply(panelCfg, {
							layoutConfig : {
								columns : numCols
							},
							items : cols
						});
			}

			this.panel = new Ext.Panel(panelCfg);
			this.panel.ownerCt = this;
			this.el = this.panel.getEl();

			if (this.forId && this.itemCls) {
				var l = this.el.up(this.itemCls).child('label', true);
				if (l) {
					l.setAttribute('htmlFor', this.forId);
				}
			}

			var fields = this.panel.findBy(function(c) {
						return c.isFormField;
					}, this);

			this.items = new Ext.util.MixedCollection();
			this.items.addAll(fields);
		}
		Ext.form.CheckboxGroup.superclass.onRender.call(this, ct, position);
	},

	afterRender : function() {
		Ext.form.CheckboxGroup.superclass.afterRender.call(this);
		if (this.values) {
			this.setValue.apply(this, this.values);
			delete this.values;
		}
		this.eachItem(function(item) {
					item.on('check', this.fireChecked, this);
					item.inGroup = true;
				});
	},
	// private
	doLayout : function() {
		// ugly method required to layout hidden items
		if (this.rendered) {
			this.panel.forceLayout = this.ownerCt.forceLayout;
			this.panel.doLayout();
		}
	},
	// private
	fireChecked : function() {
		var arr = [];
		this.eachItem(function(item) {
					if (item.checked) {
						arr.push(item);
					}
				});
		this.fireEvent('change', this, arr);
	},

	// private
	validateValue : function(value) {
		if (!this.allowBlank) {
			var blank = true;
			this.eachItem(function(f) {
						if (f.checked) {
							return (blank = false);
						}
					});
			if (blank) {
				this.markInvalid(this.blankText);
				return false;
			}
		}
		return true;
	},

	// private
	onDisable : function() {
		this.eachItem(function(item) {
					item.disable();
				});
	},

	// private
	onEnable : function() {
		this.eachItem(function(item) {
					item.enable();
				});
	},

	// private
	doLayout : function() {
		if (this.rendered) {
			this.panel.forceLayout = this.ownerCt.forceLayout;
			this.panel.doLayout();
		}
	},

	// private
	onResize : function(w, h) {
		this.panel.setSize(w, h);
		this.panel.doLayout();
	},

	// inherit docs from Field
	reset : function() {
		Ext.form.CheckboxGroup.superclass.reset.call(this);
		this.eachItem(function(c) {
					if (c.reset) {
						c.reset();
					}
				});
	},

	/**
	 * {@link Ext.form.Checkbox#setValue Set the value(s)} of an item or items
	 * in the group. Examples illustrating how this method may be called:
	 * 
	 * <pre><code>
	 * // call with name and value
	 * myCheckboxGroup.setValue('cb-col-1', true);
	 * // call with an array of boolean values 
	 * myCheckboxGroup.setValue([true, false, false]);
	 * // call with an object literal specifying item:value pairs
	 * myCheckboxGroup.setValue({
	 * 			'cb-col-2' : false,
	 * 			'cb-col-3' : true
	 * 		});
	 * // use comma separated string to set items with name to true (checked)
	 * myCheckboxGroup.setValue('cb-col-1,cb-col-3');
	 * </code></pre>
	 * 
	 * See {@link Ext.form.Checkbox#setValue} for additional information.
	 * 
	 * @param {Mixed}
	 *            id The checkbox to check, or as described by example shown.
	 * @param {Boolean}
	 *            value (optional) The value to set the item.
	 * @return {Ext.form.CheckboxGroup} this
	 */
	setValue : function(id, value) {
		if (this.rendered) {
			if (arguments.length == 1) {
				if (Ext.isArray(id)) {
					// an array of boolean values
					Ext.each(id, function(val, idx) {
								var item = this.items.itemAt(idx);
								if (item) {
									item.setValue(val);
								}
							}, this);
				} else if (Ext.isObject(id)) {
					// set of name/value pairs
					for (var i in id) {
						var f = this.getBox(i);
						if (f) {
							f.setValue(id[i]);
						}
					}
				} else {
					this.setValueForItem(id);
				}
			} else {
				var f = this.getBox(id);
				if (f) {
					f.setValue(value);
				}
			}
		} else {
			this.values = arguments;
		}
		return this;
	},

	// private
	onDestroy : function() {
		Ext.destroy(this.panel);
		Ext.form.CheckboxGroup.superclass.onDestroy.call(this);

	},

	setValueForItem : function(val) {
		val = String(val).split(',');
		this.eachItem(function(item) {
					if (val.indexOf(item.inputValue) > -1) {
						item.setValue(true);
					}
				});
	},

	// private
	getBox : function(id) {
		var box = null;
		this.eachItem(function(f) {
			if (id == f || f.dataIndex == id || f.id == id || f.getName() == id) {
				box = f;
				return false;
			}
		});
		return box;
	},

	/**
	 * Gets an array of the selected {@link Ext.form.Checkbox} in the group.
	 * 
	 * @return {Array} An array of the selected checkboxes.
	 */
	getValue : function() {
		var out = [];
		this.eachItem(function(item) {
					if (item.checked) {
						out.push(item);
					}
				});
		return out;
	},

	// private
	eachItem : function(fn) {
		if (this.items && this.items.each) {
			this.items.each(fn, this);
		}
	},

	/**
	 * @cfg {String} name
	 * @hide
	 */
	/**
	 * @method initValue
	 * @hide
	 */
	initValue : Ext.emptyFn,
	/**
	 * @method getValue
	 * @hide
	 */
	getValue : Ext.emptyFn,
	/**
	 * @method getRawValue
	 * @hide
	 */
	getRawValue : Ext.emptyFn,

	/**
	 * @method setRawValue
	 * @hide
	 */
	setRawValue : Ext.emptyFn

});

Ext.reg('checkboxgroup', Ext.form.CheckboxGroup);

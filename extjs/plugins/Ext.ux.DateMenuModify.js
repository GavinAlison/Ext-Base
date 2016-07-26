/**
 * 修正firefox下 日期控件被拉长
 */
Ext.override(Ext.menu.DateMenu, {
			autoWidth : function() {
				var el = this.el, ul = this.ul;
				if (!el) {
					return;
				}
				var w = this.width;
				if (w) {
					el.setWidth(w);
				} else if (Ext.isIE && !Ext.isIE8) {
					el.setWidth(this.minWidth);
					var t = el.dom.offsetWidth;
					el.setWidth(ul.getWidth() + el.getFrameWidth("lr"));
				}
			},
			render : function() {
				Ext.menu.DateMenu.superclass.render.call(this);
				if (Ext.isGecko) {
					this.picker.el.dom.childNodes[0].style.width = '178px';
					this.picker.el.dom.style.width = '178px';
				}
			}
		});
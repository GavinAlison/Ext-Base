<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/page/common/taglibs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<%@ include file="/page/common/scripts.jsp"%>



 

<script type="text/javascript" src="Ext.ux.MonthPicker.js"></script>
<script type="text/javascript" src="monthmenu.js"></script>

<link rel="stylesheet" type="text/css" href="monthmenu.css" />



</head>
<body>

<h1>Toolbar with MonthMenu</h1>
<p>The js is not minified so it is readable. See <a href="monthmenu.js">monthmenu.js</a>.</p>

<p>The first MonthMenu is nothing special. You can set the value of the element/picker
via <span class="code">this.menu.picker.setValue(Date)</span> in the <span class="code">menushow</span> listener. So one option is parsing the displayed
button text and get a valid date if you previously set a proper text (using <span class="code">Button.setText(String)</span>).</p>
<p>The second MonthMenu example shows how to define a date range for valid values in the picker. 
So the user can only select from the allowed ones.</p>
<p>Finally set up a handler for the MonthMenu to process any changes made via the picker.
You have access to the <span class="code">oldValue</span> and <span class="code">newValue</span>. So take the appropriate/desired 
actions (e.g. reload a grid, send a request to the server, ...) depending on these two values.</p>
<div id="container">
    <div id="toolbar"></div>
</div>
<br /><br /><br /><br /><br />
</body>
</html>

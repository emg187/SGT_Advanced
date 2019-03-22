/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready( startApp );

var SGT;
function startApp(){
	/*
	startTests will test your code.  Once it works, 
	delete startTests and uncomment the code below to run YOUR code and test it
	*/
	//intiateTestDisplay();
	//startTests();
	
	SGT = new SGT_template({
		addButton: $(".add_button"),
		cancelButton: $(".cancel_button"),
		nameInput: $(".name_input"),
		courseInput: $(".course_input"),
		gradeInput: $(".grade_input"),
		displayArea: $(".student_display"),
		averageArea: $(".average"), 
	});
	SGT.addEventHandlers();
	SGT.getServerData();
}


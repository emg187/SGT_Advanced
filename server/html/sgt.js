class SGT_template{
	/* constructor - sets up sgt object 
	params: (object) elementConfig - all pre-made dom elements used by the app
	purpose: 
		- Instantiates a model and stores pre-made dom elements it this object
		- Additionally, will generate an object to store created students 
		  who exists in our content management system (CMS)
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	constructor(elementConfig){
		this.domElements = {
			addButton: elementConfig.addButton,
			averageArea: elementConfig.averageArea,
			cancelButton: elementConfig.cancelButton,
			courseInput: elementConfig.courseInput,
			displayArea: elementConfig.displayArea,
			gradeInput: elementConfig.gradeInput,
			nameInput: elementConfig.nameInput, 
		};
		this.data = {};
		this.handleAdd = this.handleAdd.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.clearInputs = this.clearInputs.bind(this);
		this.deleteStudent = this.deleteStudent.bind(this);
		this.getServerData = this.getServerData.bind(this);
		this.handleServerData = this.handleServerData.bind(this);
		this.handleServerError = this.handleServerError.bind(this);
	}
	/* addEventHandlers - add event handlers to premade dom elements
	adds click handlers to add and cancel buttons using the dom elements passed into constructor
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/

	addEventHandlers(){
		this.domElements.addButton.click(this.handleAdd);
		this.domElements.cancelButton.click(this.handleCancel);
	}
	/* clearInputs - take the three inputs stored in our constructor and clear their values
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	clearInputs(){
		this.domElements.courseInput.val("");
		this.domElements.gradeInput.val("");
		this.domElements.nameInput.val("");
	}
	/* handleCancel - function to handle the cancel button press
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	handleCancel(){
		this.clearInputs();
	}
	/* handleAdd - function to handle the add button click
	purpose: grabs values from inputs, utilizes the model's add method to save them, then clears the inputs and displays all students
	params: none
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	handleAdd(){
		var studentName = this.domElements.nameInput.val();
		var studentCourse = this.domElements.courseInput.val();
		var studentGrade = this.domElements.gradeInput.val();

		if (studentName==="" || studentCourse==="" || studentGrade===""){
			return;
		} else {
			
			$.ajax({
				url: "http://s-apis.learningfuze.com/sgt/create",
				method: "post",
				data: {
					"api_key": "u0IDQ6YttX",
					"name": studentName,
					"course": studentCourse,
					"grade": studentGrade
				},
				dataType: "json",
				success: this.getServerData,
				error: this.handleServerError,
			});
			this.clearInputs();
		}
	}
	/* displayAllStudents - iterate through all students in the model
	purpose: 
		grab all students from model, 
		iterate through the retrieved list, 
		then render every student's dom element
		then append every student to the dom's display area
		then display the grade average
	params: none
	return: undefined
	ESTIMATED TIME: 1.5 hours
	*/
	displayAllStudents(){
		this.domElements.displayArea.empty();

		var studentIDs = Object.keys(this.data);
		for (var studentIndex=0; studentIndex<studentIDs.length; studentIndex++){
			var studentRow = this.data[studentIDs[studentIndex]].render();
			this.domElements.displayArea.append(studentRow);
		}
		this.displayAverage();
	}
	/* displayAverage - get the grade average and display it
	purpose: grab the average grade from the model, and show it on the dom
	params: none
	return: undefined 
	ESTIMATED TIME: 15 minutes

	*/

	displayAverage(){
		var studentIDs = Object.keys(this.data);
		var gradeAverage = 0;
		for (var studentIndex=0; studentIndex<studentIDs.length; studentIndex++){
			gradeAverage+=this.data[studentIDs[studentIndex]].data.grade;
		}
		gradeAverage/=studentIDs.length;
		gradeAverage = gradeAverage.toFixed(2);
		var averageText = this.domElements.averageArea.text();
		averageText+=gradeAverage;
		this.domElements.averageArea.text(averageText);
	}
	/* createStudent - take in data for a student, make a new Student object, and add it to this.data object

		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	purpose: 
			If no id is present, it must pick the next available id that can be used
			when it creates the Student object, it must pass the id, name, course, grade, 
			and a reference to SGT's deleteStudent method
	params: 
		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	return: false if unsuccessful in adding student, true if successful
	ESTIMATED TIME: 1.5 hours
	*/
	createStudent(name, course, grade, id){
		var studentIDs = Object.keys(this.data);

		if (typeof id==="undefined" && studentIDs.length===0){
			id = 1;
			this.data[id] = new Student(id, name, course, grade, this.deleteStudent);
			return true;
		} else if (typeof id==="undefined"){
			id = parseInt(studentIDs[studentIDs.length-1])+1;
			this.data[id] = new Student(id, name, course, grade, this.deleteStudent);
			return true;
		} else {
			if (!this.doesStudentExist(id)){
				this.data[id] = new Student (id, name, course, grade, this.deleteStudent);
				return true;
			} else {
				return false;
			}
		}
	}
	/* doesStudentExist - 
		determines if a student exists by ID.  returns true if yes, false if no
	purpose: 
			check if passed in ID is a value, if it exists in this.data, and return the presence of the student
	params: 
		id: (number) the id of the student to search for
	return: false if id is undefined or that student doesn't exist, true if the student does exist
	ESTIMATED TIME: 15 minutes
	*/
	doesStudentExist(id){
		var studentIDs = Object.keys(this.data);
		for (var studentIndex=0; studentIndex<studentIDs.length; studentIndex++){
			if (id===parseInt(studentIDs[studentIndex])){
				return true;
			}
		}
		return false;
	}
	/* readStudent - 
		get the data for one or all students
	purpose: 
			determines if ID is given or not
			if ID is given, return the student by that ID, if present
			if ID is not given, return all students in an array
	params: 
		id: (number)(optional) the id of the student to search for, if any
	return: 
		a singular Student object if an ID was given, an array of Student objects if no ID was given
		ESTIMATED TIME: 45 minutes
	*/
	readStudent(id){
		if (typeof id==="undefined"){
			var studentArray = [];
			var studentIDs = Object.keys(this.data);
			for (var studentIndex=0; studentIndex<studentIDs.length; studentIndex++){
				studentArray.push(this.data[studentIDs[studentIndex]]);
			}
			return studentArray;
		} else {
			if (typeof this.data[id]==="undefined"){
				return false;
			} else {
				return this.data[id];
			}
		}
	}
	/* updateStudent - 
		not used for now.  Will be used later
		pass in an ID, a field to change, and a value to change the field to
	purpose: 
		finds the necessary student by the given id
		finds the given field in the student (name, course, grade)
		changes the value of the student to the given value
		for example updateStudent(2, 'name','joe') would change the name of student 2 to "joe"
	params: 
		id: (number) the id of the student to change in this.data
		field: (string) the field to change in the student
		value: (multi) the value to change the field to
	return: 
		true if it updated, false if it did not
		ESTIMATED TIME: no needed for first versions: 30 minutes
	*/
	updateStudent(){

	}
	/* deleteStudent - 
		delete the given student at the given id
	purpose: 
			determine if the ID exists in this.data
			remove it from the object
			return true if successful, false if not
			this is often called by the student's delete button through the Student handleDelete
	params: 
		id: (number) the id of the student to delete
	return: 
		true if it was successful, false if not
		ESTIMATED TIME: 30 minutes
	*/
	deleteStudent(id){
		if (typeof id==="number"){
			if (this.doesStudentExist(id)){
				delete this.data[id];
				var ajaxObj = {
					url: "http://s-apis.learningfuze.com/sgt/delete", 
					method: "post", 
					data: {
						"api_key": "u0IDQ6YttX", 
						"student_id": id, 
					}
				}
				$.ajax(ajaxObj)
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	getServerData(){
		
		$.ajax({
			url: "api/grades",
			method: "get",
			data: {
				"api_key": "u0IDQ6YttX",
			},
			dataType: "json",
			success: this.handleServerData,
			error: this.handleServerError
		});
	}

	handleServerData(result){
		
		for (var studentIndex=0; studentIndex<result.data.length; studentIndex++){
			this.createStudent(result.data[studentIndex].name, 
								result.data[studentIndex].course, 
								result.data[studentIndex].grade, 
								result.data[studentIndex].id);
		}
		this.displayAllStudents();
	}

	handleServerError(result){
		console.log(result);
	}
}

	
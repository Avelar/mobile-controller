var shared = (function(){

  var main;
  var modules = {};

  // Get modules from main app, so that we can call them when using the page router
  function setModules(_main, _modules){
    main = _main;
    modules = _modules;
    console.log(main);    
    // Send the main app to each module
    for(m in modules){
      modules[m].setMainApp(main);
    }
    console.log(modules);
  }

  // A function where we detect the change of '#' on the browser address field
  function hashRouter(){
    var currentPage;

    // Let's create some redirects just to make sure the user won't skip any step
    if(localStorage["isConnected"] == 0){
      location.hash = "connection";
      console.log("hey");
    }else if(localStorage["isCalibrated"] == 0){
      location.hash = "calibration";
    }

    currentPage = location.hash.substring(1, location.hash.length);
    console.log('Current hash is ' + currentPage);
    render(currentPage);
  }

  // Render the section templates based hash change
  function render(section){
    console.log("render: " + section);
    
    var id = "tpl-" + section;

    var sections = document.getElementsByTagName("section");
    for(var i = 0; i < sections.length; i++){
      if(sections[i].id === id){
        sections[i].classList.remove("hidden");
      }else{
        sections[i].classList.add("hidden");
      }
    }
    initModule(section);
  }

  // Called when user lands on "page"
  function initModule(section){
    // console.log(section);
    // console.log(modules);
    modules[section].init();
  }

  function disconnect(){
    localStorage["isConnected"] = 0;
    localStorage["isCalibrated"] = 0;
    location.hash = "connection";
  } 

	return {
    setModules: setModules,
		hashRouter: hashRouter,
		disconnect: disconnect
	};
})();
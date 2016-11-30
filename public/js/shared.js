var shared = (function(){

  // A function where we detect the change of '#' on the browser address field
  function hashRouter(){
    var currentPage;

    //Let's create some redirects just to make sure the user won't skip any step
    if(!localStorage["isConnected"]){
      location.hash = "connection";
    }else if(!localStorage["isCalibrated"]){
      location.hash = "calibration";
    }

    currentPage = location.hash.substring(1, location.hash.length);
    console.log('Current hash is ' + currentPage);
    render("tpl-" + currentPage);
  }

  // Render the section templates based hash change
  function render(section){
    console.log("render: " + section);

    var sections = document.getElementsByTagName("section");
    for(var i = 0; i < sections.length; i++){
      if(sections[i].id === section){
        sections[i].classList.remove("hidden");
      }else{
        sections[i].classList.add("hidden");
      }
    }
  }

  function disconnect(){
    localStorage["isConnected"] = false;
    localStorage["isCalibrated"] = false;
    location.hash = "connection";
  }

	return {
		hashRouter: hashRouter,
		disconnect: disconnect
	};
})();
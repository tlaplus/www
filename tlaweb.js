/***************************************************************************
* This file contains the JavaScript used by the TLA+ web site's pages.     *
***************************************************************************/

/*****************************************************************************
* POSSIBLE ENHANCEMENTS.                                                     *
*                                                                            *
* 1. Changing how the browser's back button interacts with show/hide.        *
* ----------------------------------------------------------------           *
* When jumping from inside an unhidden section to another page, it's         *
* possible to add to the link a back-link parameter that causes the          *
* destination's back button to return to that section.  However, the         *
* browser's back button will cause the page to be redisplayed with that      *
* unhidden section hidden again.  To prevent that, we can use the            *
* JavaScript sessionStorage methods described at                             *
*                                                                            *
* https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage     *
*                                                                            *
* Stored values have to be strings.  This can be used to implement a         *
* database of <key, value> pairs for each page that persists until the       *
* browser is closed.  When the page is reloaded, the initialize() function   *
* could examine this database to do whatever is required to open the page    *
* in the desired state.  That database can also be used to do other          *
* appropriate things on mouse clicks.                                        *
*                                                                            *
* For restoring the state when the user jumps back to a page, the key        *
* click that takes the user to another page should store the appropriate     *
* show/hide state and the current time in the page's database.  The          *
* show/hide state can be restored iff not too much time has elapsed          *
* between leaving the page and returning to it.                              *

2. Implementing links to a hidden section of the same page.
-----------------------------------------------------------

It would be nice to be able to have a link to a part of the page
that is hidden jump to that part and open it.  
*****************************************************************************/

/***************************************************************************
* The show/hide toggling of the sections on high-level-view.html is        *
* accomplished by the following html:                                      *
*                                                                          *
*   <H2 id ="title-id"                                                     *
*       class="show-hide"                                                  *
*       onclick="showHide('hide-id','content-id')">Title Text              *
*       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                                     *
*       <font id="hide-id" > [show/hide]</font>                            *
*   </H2>                                                                  *
*   <DIV id="content-id" class="show-hide">                                *
*      The content to be shown/hidden.                                     *
*   </DIV>                                                                 *
*                                                                          *
* where "show/hide" and "none/block" should be "show" and "none" if the    *
* content is initially hidden, and "hide" and "block" if the content is    *
* initially shown.                                                         *
*                                                                          *
* Alternatively, only "show" and "hidden" can be used in the html file     *
* and initializeShowHide("hide-id", "contentid") is called by the          *
* initialize() function to initially show the content.                     *
*                                                                          *
* The "show-hide" class causes the Title Text and the [show/hide] to       *
* toggle between red and black as the mouse moves over and out of it.      *
* The "popup" class causes the [show/hide] to toggle between [show] and    *
* [hide] on mouse clicks.                                                  *
*                                                                          *
* The variables initButton and initDiv specify a show/hide section to be   *
* initialized, where they should equal the values of the hide-id and       *
* content-id ids in the description above.  They are initialized with the  *
* values "hide-intro" and "intro", and should be changed in a <script>     *
* </script> section in the html file to override those values.             *
*                                                                          *
* To create a link to a place with the particular show/hide section        *
* defined above shown, use                                                 *
*                                                                          *
*    href = "url?unhideBut=hide-id&unhideDiv=content-id"                   *
*                                                                          *
* where url is the desired url, which may contain a #anchor suffix.        *
* See below for how to put such an href value into a back-link.            *
***************************************************************************/

function showHide(buttonId, contentId) {
  /*************************************************************************
  * This function is used as explained above.                              *
  *************************************************************************/
  var button = document.getElementById(buttonId);
  var content = document.getElementById(contentId);
  if (content.style.display == "block") 
    { function showHide(buttonId, contentId) {
        var button = document.getElementById(buttonId);
        var content = document.getElementById(contentId);
        if (content.style.display == "block") {
          content.style.display = "none" ;
          button.innerHTML="[show]";
         }
        else { 
          content.style.display = "block";
           button.innerHTML="[hide]";
              }
       } ;
      content.style.display = "none" ;
      button.innerHTML="[show]";
   }
  else { 
    content.style.display = "block";
    button.innerHTML="[hide]";
    }
} 


/*****************************************************************************
* The following function should be called by the onclick field of an <A>     *
* tag that links to a show/hide section of the current page.  It causes      *
* that section to be shown (and does nothing if it is already shown).  The   *
* buttonId argument is the id of the <FONT> item containing the "[show]" or  *
* "[hide]" text and contentId is the id of the <DIV> item containing the     *
* contents of the section.                                                   *
*****************************************************************************/
function show(buttonId, contentId) {
  var button = document.getElementById(buttonId);
  var content = document.getElementById(contentId);
  content.style.display = "block";
  button.innerHTML="[hide]";
} 

var initButton = "hide-intro" ;
var initDiv = "intro" ;

function initializeShowHide() {
  /*************************************************************************
  * This function causes the show/hide section identified by initButton    *
  * and initDiv to be shown when the page is open.  It is called by        *
  * initialize().  However, initialize() is not called by clicking on a    *
  * link within the page to the page itself.  A link to a show/hide section  *
  * from within the page itself include a link to the show(...)  function    *
  * defined above to cause that section to be shown.                         *
  *************************************************************************/
  // We first hide all <DIV>s with class="hidden-div".
  var x = document.getElementsByClassName("hidden-div");
  for (var i=0; i < x.length; i++) {
     x[i].style.display = "none";
   } ;
  var buttonId = initButton ;
  var contentId = initDiv ;
  var hideButton = getParameterByName("unhideBut") ;
  if (hideButton != null) {
    buttonId = hideButton ;
    contentId = getParameterByName("unhideDiv");
    } ;
  if (buttonId != null)  {
     var button = document.getElementById(buttonId);
     var content = document.getElementById(contentId);
     if (button != null) {
        if (content == null) {
           console.log("No tag with id = " + contentId) ;
          }
        content.style.display = "block";
       button.innerHTML="[hide]";
       }
   } 
}


/***************************************************************************
* The following functions control the toggling of text between red and     *
* black or blue described above.  The first three are the functions that   *
* are attached to mouse events on the individual elements.  The fourth     *
* function is called by the initialize() function to attach those          *
* functions to all elements of the appropriate class.                      *
***************************************************************************/
function mouseIn(id) {
  var obj = document.getElementById(id);
  obj.style.color="red";
  obj.style.cursor="pointer";
}

function mouseOut(id) {
  var obj = document.getElementById(id);
  obj.style.color="blue";
  obj.style.cursor="default";
}

function mouseOutBlack(id) {
  var obj = document.getElementById(id);
  obj.style.color="black";
  obj.style.cursor="default";
}

function initializeMouseOverColoring() {
//  var x = document.getElementsByClassName("popup");
//  for (var i=0; i < x.length; i++) {
//     x[i].onmouseover = function() { mouseIn(this.id) ; } ;
//     x[i].onmouseout  = function() { mouseOut(this.id) ;} ;
//   } ;
  x = document.getElementsByClassName("show-hide");
  for (var i=0; i < x.length; i++) {
     x[i].onmouseover = function() { mouseIn(this.id) ; } ;
     x[i].onmouseout  = function() { mouseOutBlack(this.id) ;} ;
   } ;
  x = document.getElementsByClassName("popup-blue");
  for (var i=0; i < x.length; i++) {
     x[i].onmouseover = function() { mouseIn(this.id) ; } ;
     x[i].onmouseout  = function() { mouseOut(this.id) ;} ;
   } ;

}


function popup(link, height) {
  /*************************************************************************
  * Displays the html file whose name (a string) is link in a pop-up       *
  * window of the specified height.  This should be used as follows:       *
  *                                                                        *
  *   <font id      = "..."                                                *
  *         class   = "popup-blue"                                         *
  *         color = "blue"                                                 *
  *         onclick = "popup('linkname.html',175)">                        *
  *   <b>text</b></font>                                                   *
  *************************************************************************/
  window.open(link, "", // This argument seems to do nothing
             "width=500,scrollbars=no,menubar=no,"
           + "resizable=no,status=no,titlebar=no,toolboar=no,height=" 
           + height);
}

function popupw(link, height, width) {
  window.open(link, "", // This argument seems to do nothing
             "width=" + width +",scrollbars=no,menubar=no,"
           + "resizable=no,status=no,titlebar=no,toolboar=no,height=" 
           + height);
  /*************************************************************************
  * Like popup, but sets the width as well, whereas popup always uses      *
  * width = 500.                                                           *
  *************************************************************************/
 }

/***************************************************************************
* Functions for creating the left-hand column in the two-column style.     *
***************************************************************************/
function leftHandColEntry(name, url) {
  /*************************************************************************
  * Equals html code for one entry in the left-hand column with text       *
  * 'name' that is a link to the 'url'.  If url equals "", then no link    *
  * is created.                                                            *
  *************************************************************************/
  var result = "<p style=\"margin-top:30px\" >" ;
  if (url != "" ) {
    result = result + "\n<a href = \"" + url + "\">" + name + "</a>\n" ;
    }    
  else {
    result = result + " " + name + " ";
    }  
  result = result + "</p>";
  return result;
}

function creatLeftHandCol(list, noLinkName) {
  /*************************************************************************
  * This creates the html code for the left-hand column of a two-column    *
  * page, where 'list' is a sequence of name, url arguments for            *
  * createLeftHandColEntry -- separated by "@" and "$" characters.  For    *
  * example:                                                               *
  *                                                                        *
  *    name1@url1$name2@url2$name3@$name4@url4                             *
  *                                                                        *
  * The entry is not made a link if the url specified by the list equals   *
  * "" or the name specified by the list equals the noLinkName argument    *
  * (or both).                                                             *
  *                                                                        *
  * It also creates the 'hide/show left column' arrows.  More precisely,   *
  * it creates the 'hide left column' arrow and it converts                *
  *                                                                        *
  *    <div  id = "showleftcol" > </div>                                   *
  *                                                                        *
  * in the html file into the 'show left column' arrow.                    *
  *                                                                        *
  * On 4 Jan 2019, this function was modified to add a left margin to the  *
  * main text, to put space between it and the left-hand column for        *
  * better readability.                                                    *
  *************************************************************************/
  var input = list ;
  var result = 
     "<div id = \"hideleftcol\" style=" +
     "\"margin-top:0px;margin-bottom:-22px;margin-left:0px;color:blue\" " + 
     "onclick=\"hideLeftCol()\" onmouseover=\"mouseIn('hideleftcol')\"" +
     "onmouseout=\"mouseOut('hideleftcol')\">" +
     "<b style=\"margin-left:110px\">&larr;</b> </div> " +
     "<img src=\"splash_small.png\" width=120px\n" +
      "     style=\"margin-top:24px;margin-bottom:-13px\"" +
     "  onmouseover=\"mouseIn('hideleftcol')\"" +
     "  onmouseout=\"mouseOut('hideleftcol')\"" +
     "  onclick=\"hideLeftCol()\">\n" +
      "<div>\n" +
      "  <a class=\"back-link\" style=\"display:none\" href=\"\">\n" +
      "   <p style=\"margin-top:30px;margin-bottom:-52px\"><b>Back</b></p>\n" +
      "  </a>\n" +
      "  <p style=\"margin-bottom:63px\">&nbsp;</p>\n" +
      "</div>\n" ;
  
  while (input != "") {
    var pos = input.indexOf("@") ;
    var name = input.substring(0, pos) ;
    input = input.substring(pos+1,input.length) ;
    pos = input.indexOf("$") ;
    if (pos == -1) {
      console.log("missing $ in argument to createLeftHandCol") ;
      return result + "\nError" ;
      }
    var url = input.substring(0, pos) ;
    if (name == noLinkName) { url = "";} ;
    input = input.substring(pos+1,input.length) ;
    result = result + "\n" + leftHandColEntry(name, url) ;
    }

  result = result + "\n <font color=#f6f6f2>ccc</font>";
  var col = document.getElementById("main_leftcolumn") ;
  col.innerHTML = result ;
  // set 'show left column' arrow
  var id = document.getElementById("showleftcol");
  if (id != null) {
     id.style   = "margin-top:0px;margin-bottom:-22px;display:none;color:blue";
     id.onclick = function() { showLeftCol() ; } ;
     id.onmouseover = function() { mouseIn('showleftcol'); } ; 
     id.onmouseout = function() { mouseOut('showleftcol'); } ;
     id.innerHTML = 
       "<b style=\"marginright=200px\">&rarr;</b>" ;
   }

  // add a left margin to the main text
  id = document.getElementById("main_contentcolumn") ;
  if (id != null) {
    id.style.paddingLeft="15px";
   }
}

function hideLeftCol() {
  var id = document.getElementById("main_leftcolumn") ;
  id.style.display = "none" ;
  id = document.getElementById("showleftcol") ;
  id.style.display = "block" ;
}

function showLeftCol() {
  var id = document.getElementById("main_leftcolumn") ;
  id.style.display = "" ;
  id = document.getElementById("showleftcol") ;
  id.style.display = "none" ;
}



/***************************************************************************
* A parameter is passed to the initialize() function when the page is      *
* opened by calling it with a URL of the form                              *
*                                                                          *
*   foo.html?params                                                        *
*                                                                          *
* where params is a list of value declarations of the form name=value,     *
* separated by "&" characters.  The function getParameterByName(name)      *
* returns value if the params list has a declaration name=value;           *
* otherwise it returns null.                                               *
***************************************************************************/
function getParameterByName(name) {
   name = name.replace(/[\[\]]/g, '\\$&');
   var regex = new RegExp('[?&]' + name + '(=([^&%]*)|&|%|$)'),
        results = regex.exec(window.location.href);
   if (!results) return null;
   if (!results[2]) return null;
   return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


/***************************************************************************
* To create link(s) to the page that called this page, add one or more     *
* <a> elements of the form                                                 *
*                                                                          *
*        <a class="back-link" style="display:none" href=""> ... </a>       *
*                                                                          *
* The calling page should then call this page with a URL having a          *
* parameter "back-link:return-page.html" (see comments to                  *
* getParameterByName), where "return-page.html" is the calling page's url  *
* (which may contain "#name" anchor specifier).                            *
*                                                                          *
* If the back-link must contain one or more "&" or "=" characters,         *
* replace each "&" character with "@AMP" and each "=" character with       *
* "@EQ".  (This is the case if you want the back-link to contain           *
* parameters that cause a particular show/hide section to be shown.        *
*                                                                          *
* The initialize() method called when the page is loaded (by the onload    *
* field of the <BODY> element) calls the initializeBackButtons()           *
* function.                                                                *
***************************************************************************/
function initializeBackButtons() {
  var backlink =  getParameterByName("back-link") ;
  if (backlink != null) {
      var x = document.getElementsByClassName("back-link");
      backlink = backlink.replace(/@AMP/g, "&") 
      backlink = backlink.replace(/@EQ/g, "=") 
      for (var i=0; i < x.length; i++) {
        x[i].style = "block";
        x[i].href  = backlink;
       } ;
    }
 }

/***************************************************************************
* The following declares leftHandCol and noLinkName and sets them to the   *
* argument of creatLeftHandCol that produces the default left-hand column  *
* for the top-level pages with all entries having a link.  noLinkName      *
* should be reset to the proper value for a top-level page so it does not  *
* contain a link to itself.  The value of leftHandCol can also be set to   *
* a different value in the html file to produce a different left-hand      *
* column.                                                                  *
***************************************************************************/
var leftHandCol = 
    "Home@tla.html$" +
    "High-Level View@high-level-view.html$" +
    "News@news.html$" +
    "Industrial Use@industrial-use.html$" + 
    "Learning@learning.html$" +
    "The Toolbox@toolbox.html$" +
    "Tools@tools.html$" +
    "Advanced Topics@advanced.html$" +
    "More Stuff@more-stuff.html$" ;

var noLinkName = "" ;

/***************************************************************************
* The following is the default initialize() function that's executed       *
* when a web page is opened.  It can be overridden in an html file         *
* by redefining it to do something else.                                   *
***************************************************************************/
function initialize() {
  creatLeftHandCol(leftHandCol,noLinkName) ;
  initializeBackButtons();
  initializeMouseOverColoring() ;
  initializeShowHide() ;
//  console.log("Initialized");
}
// Header: navbar Burgers 2019.04.08
document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
  
      // Add a click event on each of them
      $navbarBurgers.forEach( el => {
        el.addEventListener('click', () => {
  
          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);
  
          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
  
        });
      });
    }

  });

// =================================================
// post archive: add year and month break 2019.05.28
// =================================================
// Year & Month Break
// var yearArray = new Array();
// var monthObj = new Object();
// $(".post-archive-item").each(function() {
//     var archivesYear = $(this).attr("year");
//     var archivesMonth = $(this).attr("month");
//     yearArray.push(archivesYear);
//     if (archivesYear in monthObj) {
//         monthObj[archivesYear].push(archivesMonth);
//     }
//     else {
//         monthObj[archivesYear] = new Array();
//         monthObj[archivesYear].push(archivesMonth);
//     }
// });
// var uniqueYear = $.unique(yearArray);
// for (var i = 0; i < uniqueYear.length; i++) {
//     var html = "<hr><h2>" + uniqueYear[i] + "</h2>";
//     $("[year='" + uniqueYear[i] + "']:first").before(html);
//     var uniqueMonth = $.unique(monthObj[uniqueYear[i]]);
//     for (var m = 0; m < uniqueMonth.length; m++) {
//         var html = "<h4>" + uniqueMonth[m] + "</h4>";
//         $("[year='" + uniqueYear[i] + "'][month='" + uniqueMonth[m] + "']:first").before(html);
//     }
// }

// =================================================
// search 2019.05.30
// function: open and close search form
// =================================================
if (typeof show_search == 'undefined') {
    var show_search = false;
  }
  if (!show_search) {
    $("#search-btn").show();
  }
  // click search button event
  $("#search-btn").click(function(event) {
      // $("#search-input").val("");
      $("#search-container").fadeIn();
      $("#search-btn").hide();
      $('#search-input').focus();
      $("#search-results").show();
      event.stopPropagation();
  });
  // click close button event
  $("#close-btn").click(function(event) {
    $("#search-container").hide();
    $("#search-results").hide(); 
    $("#search-btn").show(); 
    // $("#search-input").val(""); //clear search field text  
    event.stopPropagation();
  });
  // click outside of search form event
  $(document).mouseup(function(e) 
  {
      var container = $("#search-container");
      
      // if the target of the click isn't the container nor a descendant of the container
      if (show_search && !container.is(e.target) && container.has(e.target).length === 0) 
      {
          container.hide();
          $("#search-results").hide(); 
          $("#search-btn").show();
      }
  });
  // scroll event
  $(window).scroll(function(){
    $("#search-container").hide(); 
    $("#search-results").hide(); 
    $("#search-btn").show();
  });

/*----------------------------------------------------*/
/*  Prismjs Line-numbers | 2019.07.05
/*----------------------------------------------------*/
if (typeof line_numbers == 'undefined') {
  var line_numbers = false;
};
if (line_numbers) {
  $("pre").addClass("line-numbers");
};


/*----------------------------------------------------*/
/*  External link new tab | 2019.09.09
/*  Description: open external links in new tab (type:boolean)
/*  Code injection: var external_link_new_tab
/*----------------------------------------------------*/

// rules
$.expr[':'].external_new_tab = function(obj){
  return !obj.href.match(/^mailto\:/)
        && (obj.hostname != location.hostname)
        && !obj.href.match(/^javascript\:/)
        && !obj.href.match(/^$/)
};

// if (site.customConfig.exLinkNewPage) {
    $(document).ready(function(){
      // open post-content external links with new tabs
      $('.post-content a:external_new_tab').attr('target', '_blank');
      $('.post-content a:external_new_tab').addClass('ext-link');
    });
// };

// switch: external_link_new_tab, default: disabled 
// if (typeof external_link_new_tab == 'undefined') {
//   var external_link_new_tab = true;
// };

// // rules
// $.expr[':'].external_new_tab = function(obj){
//   return !obj.href.match(/^mailto\:/)
//          && (obj.hostname != location.hostname)
//          && !obj.href.match(/^javascript\:/)
//          && !obj.href.match(/^$/)
// };

// // action
// if (external_link_nofollow) {
//   $(document).ready(function(){
//     // open post-content external links with new tabs
//     $('.post-content a:external_new_tab').attr('target', '_blank');
//   });
// };

/*----------------------------------------------------*/
/*  External links nofollow | 2019.10.05
/*  Description: add nofollow to external links, exclude site in nofollow_whitelist
/*  Code injection: var external_link_nofollow (type:boolean)
/*                  var nofollow_whitelist (type: list)
/*----------------------------------------------------*/
// external nofollow, set default: disabled 
if (typeof external_link_nofollow == 'undefined') {
  var external_link_nofollow = true;
};

// nofollow whitelist, set default: empty list
if (typeof nofollow_whitelist == 'undefined') {
  var nofollow_whitelist = [
    "fizzy.cc"
    ,"www.fizzy.cc"
    ,"www.51redaiyu.com"
    ,"www.iyu.co","iyu.co"
    ,"ayolk.com"
  ];
  // example: 
  // var nofollow_whitelist = ["fizzy.cc", "blog.taiker.space", "www.iyu.co", "www.51redaiyu.com"];
};

// rules for nofollow
$.expr[':'].external_nofollow = function(obj){
  return !obj.href.match(/^mailto\:/)
         && (obj.hostname != location.hostname)
         && !(nofollow_whitelist.includes(obj.hostname))
         && !obj.href.match(/^javascript\:/)
         && !obj.href.match(/^$/)
};

// nofollow action
if (external_link_nofollow) {
  $(document).ready(function(){
    // open post-content external links with new tabs
    $('.post-content a:external_nofollow').attr('rel','noopener noreferrer nofollow');
  });
};

// showcase only available on homepage
// window.onload = function(){
//   // reveal showcase, hide placeholder
//   $('#showcase').removeClass("is-hidden");
//   $('#showcase-ph').addClass("is-hidden");
// } 
const appSettings =
  {
    logo:require("./logo.svg"), /// andere home url dan die van de app
    domain_url:"https://mijnsalvage.nl/opleiding", /// domain url
    home_url_extern:"https://mijnsalvage.nl/", /// andere home url dan die van

    translations:false, /// vertalingen mogelijk
    profile:false, /// profiel

    logo_intervention:false, /// eigen logo voor een interventie
    registration_by_student:false,/// registreren gebruiker mogelijk
    exportData:false,/// export data option

    lesson_subtitle_in_overview:true,/// show description lesson in overview student
    captionAboveImages:true,/// Adds caption above image option
    alternative_menu:false,/// Alternatief menu (met afbeeldingen) true / false

    baseThemeID:1,
    allowedThemes:[1],

    textOnImages:false,

    inLessonMenuType:2,
    showProfileOnDashboard:true,

    gamification:false,
    exam:false,

    included:true, /// zet deze uit bij het builden om het inlogscherm niet te tonen
    wordpress_import:true,
    wordpress_import_name:"salvapedia",
    wordpress_import_niceName:"Salvapedia",
    wordpress_import_icon:'fas fa-book-open',
    wordpress_import_title:'Import Salvapedia item',

    default_language:"nl",

    ///////////////////
    ////textuele variabelen
    interventieName:"Cursus",
    interventieNameMeervoud:"Cursussen",
    begeleiderName:"Coach",
    zelhulpName:"Onbegeleide zelfhulp",
    begeleideZelhulpName:"Begeleide zelfhulp",
    dagboekName:"Dagboek",
    dagboekTitle:"Je dagboek",
    dagboekItem:"dagboek item",
    dagboekItems:"Je dagboek items",
    //titleStress:"Jouw tevredenheid",
    //questionStress:"Hoe tevreden ben je?",
    //filledInStress:"Mijn tevredenheid was net",
    //graphStress:"Je tevredenheid over de afgelopen 30 dagen",

    profileCoachName:true,

    chart_color:["#c70d30", "#61758c", "#b0bac6", "#9fc7e0", "#61a8cc"],
  }
;

export {appSettings};

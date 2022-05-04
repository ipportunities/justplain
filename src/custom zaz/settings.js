const appSettings =
  {
    domain_url:"https://zaz.ipdemo.nl", /// domain url
    //domain_url:"https://dev.zaz.ipdemo.nl", /// domain url
    default_language:"nl",
    logo:require("./logo.svg"), /// andere home url dan die van de app
    logo_intervention:false, /// eigen logo voor een interventie

    ///////////////////
    ////speciale functionaliteiten
    gamification:false, //gamification badges aan of uit
    exam:false, ///examen module
    registration_by_student:false,/// registreren gebruiker mogelijk
    exportData:false,/// export data option
    exportDataRegistrations:false,/// export registraties : afhankelijk van aanmeldingsprotocol
    translations:false, /// vertalingen mogelijk
    introCourseField:true,
    liveChatAvailable:false, /// chat functionaliteit met als basis coach
    planContactOption:false, /// Coach kan contact momenten inplannen <= nog in core omdat er een tabel geplaatst dient te worden in de database
    access_date_intervention_is_option:true, /// zet datum vanaf wanneer een interventie toegangekelijk is

    ///////////////////
    ///Dashboard opties
    lesson_subtitle_in_overview:true,/// show description lesson in overview student

    ///////////////////
    ///Custom modules
    customModules:[
      {id:1,title:"Stress meter"},
    ],

    ///////////////////
    ///Weergave
    baseThemeID:1, ///basis thema
    allowedThemes:[1], //// uit welke themas kan men kiezen
    alternative_menu:false,/// Alternatief menu (met afbeeldingen) true / false
    inLessonMenuType:3, /// alternatieve menu weergave voor in de les
    myProfileInMenu:true,
    showProfileOnDashboard:false, /// salvage <= wat was dit ook al weer
    chart_color:["#141a30", "#d93d3f", "#fef1df", "#eb704a", "#f8f8f8"],

    ///////////////////
    ////Opmaak opties
    textOnImages:false, /// Optie om in de edit module text blokjes op de plaatjes te kunnen plaatsen zie respond
    captionAboveImages:false,/// Adds caption above image option

    ///////////////////
    ////Profiel
    profile:true, /// profiel aan of uit
    profileCoachName:false, /// toon profiel coach naam op het dashboard
    profileSexe:false, /// geslacht zetbaar
    profileAge:false, /// leeftijd zetbaar
    profileEducation:false, /// opleiding zetbaar

    ///////////////////
    ////Stressmeter
    stressmeter:true, //// stressmeter aan of uit
    stress_graph_color:"#fef1df", ///// kleur grafiek

    ///////////////////
    ////Coach
    max_students:false, ////max aantal studenten per coach zetbaar

    ///////////////////
    ////textuele variabelen
    interventieName:"Cursus",
    interventieNameMeervoud:"Cursussen",
    begeleiderName:"Coach",
    zelhulpName:"Onbegeleide zelfhulp",
    begeleideZelhulpName:"Begeleide zelfhulp",
    dagboekName:"Notities",
    dagboekTitle:"Je notities",
    dagboekItem:"notitie",
    dagboekItems:"Je notities",
    titleStress:"Jouw tevredenheid",
    questionStress:"Hoe tevreden ben je?",
    filledInStress:"Mijn tevredenheid was net",
    graphStress:"Je tevredenheid over de afgelopen 30 dagen",

    ///////////////////
    ///Worpress include app opties
    included:false, /// zet deze uit bij het builden om het inlogscherm niet te tonen
    //home_url_extern:"https://mijnsalvage.nl/", /// andere home url dan die van de app
    //wordpress_import:true,
    //wordpress_import_name:"salvapedia",
    //wordpress_import_niceName:"Salvapedia",
    //wordpress_import_icon:'fas fa-book-open',
    //wordpress_import_title:'Import Salvapedia item',
  }
;

export {appSettings};

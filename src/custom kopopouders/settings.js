const appSettings =
  {
    default_language:"nl",

    domain_url:"https://cursus.kopopouders.nl", /// domain url
    default_language:"nl",
    logo:require("./images/kopopouders.svg"),
    logo_intervention:false, /// eigen logo voor een interventie

    ///////////////////
    ////speciale functionaliteiten
    gamification:false, //gamification badges aan of uit
    exam:false, ///examen module
    registration_by_student:true,/// registreren gebruiker mogelijk
    exportData:true,/// export data option
    exportDataRegistrations:false,/// export registraties : afhankelijk van aanmeldingsprotocol
    translations:false, /// vertalingen mogelijk
    chatCourseAvailable:true, /// chatcursus beschikbaar
    liveChatAvailable:true, /// chat functionaliteit met als basis coach
    planContactOption:true, /// Coach kan contact momenten inplannen <= nog in core omdat er een tabel geplaatst dient te worden in de database

    ///////////////////
    ///Dashboard opties
    lesson_subtitle_in_overview:true,/// show description lesson in overview student

    ///////////////////
    ///Custom modules
    customModules:[
      {id:"c_5",title:"Koppel terug: meeste moeite"}, /// wat als opdracht meerdere keren is gedaan ; nu niet mogelijk om antwoorden op te halen
      {id:"c_1",title:"Opdracht: gezin in huis plaatsen"},
      {id:"c_2",title:"Opdracht: jouw netwerk"},
      {id:"c_6",title:"Opdracht: netwerk van jouw kind"},
      {id:"c_4",title:"Opdracht: meeste minste moeite"},
      {id:"c_3",title:"Opdracht: positieve eigenschappen van kind"},
      //{id:1,title:"Stress meter"},
    ],

    ///////////////////
    ///Weergave
    baseThemeID:4, ///basis thema
    allowedThemes:[4], //// uit welke themas kan men kiezen
    alternative_menu:false,/// Alternatief menu (met afbeeldingen) true / false
    inLessonMenuType:false, /// alternatieve menu weergave voor in de les
    myProfileInMenu:true,
    showProfileOnDashboard:false, /// salvage <= wat was dit ook al weer
    chart_color:["#00a1e4", "#0073ae", "#002e47", "#e1f4fd", "#8dd0f3"],
    
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
    profilePhone:true, /// telefoonnummer zetbaar

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
    dagboekName:"Dagboek",
    dagboekTitle:"Je dagboek",
    dagboekItem:"dagboek",
    dagboekItems:"Je dagboek items",
    titleStress:"",
    questionStress:"",
    filledInStress:"",
    graphStress:"",
    goalsName:"Jouw opdrachten",

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

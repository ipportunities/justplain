const appSettings =
  {
    logo:require("./logo.png"), /// andere home url dan die van de app
    domain_url:"https://respond.ipdemo.nl", /// domain url
    home_url_extern:"https://respond.ipdemo.nl/", /// andere home url dan die van de app
    translations:true, /// vertalingen mogelijk true / false
    profile:true, /// profiel true / false
    included:false, /// zet deze uit bij het builden om het inlogscherm niet te tonen
    //// ook package.json aanpassen
    logo_intervention:false, /// eigen logo voor een interventie
    registration_by_student:false,/// registreren gebruiker mogelijk
    exportData:false,/// export data option

    lesson_subtitle_in_overview:true,/// show description lesson in overview student
    captionAboveImages:true,/// Adds caption above image option
    alternative_menu:false,/// Alternatief menu (met afbeeldingen) true / false

    baseThemeID:1,
    allowedThemes:[1],

    wordpress_import:false,
    //wordpress_import_name:"salvapedia",
    //wordpress_import_niceName:"Salvapedia",
    //wordpress_import_icon:'fas fa-book-open',
    //wordpress_import_title:'Import Salvapedia item',

    default_language:"nl",
  }
;

export {appSettings};

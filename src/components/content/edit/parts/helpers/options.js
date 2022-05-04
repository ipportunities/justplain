import uuid from "uuid";
import {appSettings} from "../../../../../custom/settings";

const componentOptions = [
  {
    ///CONTENT
    title:'Tekst', /// niet aanpassen
    niceName:"Tekst",
    icon:'far fa-file-alt',
    parentGroup:'text',
    subtypes: [
      {
        ref:"paragraaf", /// niet aanpassen
        niceName:"paragraaf"
      },
      {
        ref:"koptekst", /// niet aanpassen
        niceName:"koptekst"
      },
      {
        ref:"paragraaf met koptekst", /// niet aanpassen
        niceName:"paragraaf met koptekst"
      },
      {
        ref:"met afbeelding links", /// niet aanpassen
        niceName:"met afbeelding links 50 - 50"
      },
      {
        ref:"met afbeelding rechts", /// niet aanpassen
        niceName:"met afbeelding rechts  50 - 50"
      },
      {
        ref:"met afbeelding links kwart", /// niet aanpassen
        niceName:"met afbeelding links 25 - 75"
      },
      {
        ref:"met afbeelding rechts kwart", /// niet aanpassen
        niceName:"met afbeelding rechts  75 - 25"
      },
      {
        ref:"twee kolommen", /// niet aanpassen
        niceName:"twee kolommen"
      },
      {
        ref:"omkaderd tekstblok", /// niet aanpassen
        niceName:"omkaderd tekstblok"
      }],
    content:{
      type:"wysiwyg",
      subtype:"paragraaf",
      content:"",
      content2:"",
      items:[{content:"",checked:false, id:uuid.v4()}],
      question:"",
      url:"",
      images:[],
    },
  },
  {
    title:'List',  /// niet aanpassen
    niceName:"List",
    icon:'fas fa-list',
    parentGroup:'text',
    subtypes:[
      {
        ref:"ongenummerde lijst", /// niet aanpassen
        niceName:"ongenummerde lijst"
      },
      {
        ref:"nummers", /// niet aanpassen
        niceName:"nummers"
      },
      {
        ref:"aanvulbare lijst", /// niet aanpassen
        niceName:"aanvulbare lijst"
      }],
    content:{
      subtype:"nummers",
      type:"list",
      addItemText:"",
      items:[{content:"",checked:false, id:uuid.v4()}],
      question:"",
      images:[],
    },
  },
  {
    title:'Quote', /// niet aanpassen
    niceName:"Quote",
    icon:'fas fa-quote-right',
    parentGroup:'text',
    subtypes:[
      {
        ref:"inspringen met quoter veld", /// niet aanpassen
        niceName:"inspringen met quoter veld"
      },
      {
        ref:"omkaderd met quoter veld", /// niet aanpassen
        niceName:"omkaderd met quoter veld"
      }],
    content:{
      subtype:"inspringen",
      type:"quote",
      content:"",
      items:[{content:"",checked:false, id:uuid.v4()}],
      question:"",
      url:"",
      images:[],
    },
  },
  //// MEDIA
  {
    title:'Video', /// niet aanpassen
    niceName:"Video",
    icon:'fa fa-video',
    parentGroup:'media',
    subtypes:[
      {
        ref:"grote video", /// niet aanpassen
        niceName:"Grote video"
      },
      {
        ref:"video links tekst rechts", /// niet aanpassen
        niceName:"Video links tekst rechts"
      },
      {
        ref:"video rechts tekst links", /// niet aanpassen
        niceName:"Video rechts tekst links"
      },
      {
        ref:"twee videos naast elkaar", /// niet aanpassen
        niceName:"Twee videos naast elkaar"
      },
    ],
    content:{
      type:"video",
      content:"",
      items:[{content:"",checked:false, id:uuid.v4()}],
      question:"",
      url:"",
      url_two:"",
      images:[],
    },
  },
  {
    title:'Audio', /// niet aanpassen
    niceName:"Audio",
    icon:'fas fa-volume-up',
    parentGroup:'media',
    subtypes:[],
    content:{
      type:"audio",
      content:"",
      items:[{content:"",checked:false, id:uuid.v4()}],
      question:"",
      url:"",
      images:[],
    },
  },
  {
    title:'Afbeelding', /// niet aanpassen
    niceName:"Afbeelding",
    icon:'far fa-image',
    parentGroup:'media',
    subtypes:[
      {
        ref:"gecentreerd", /// niet aanpassen
        niceName:"gecentreerd"
      },
      {
        ref:"volle breedte", /// niet aanpassen
        niceName:"volle breedte"
      },
      {
        ref:"carousel", /// niet aanpassen
        niceName:"carousel"
      },
      {
        ref:"tekst op afbeelding",/// niet aanpassen
        niceName:"tekst op afbeelding"
      },
      {
        ref:"twee afbeeldingen naast elkaar", /// niet aanpassen
        niceName:"twee afbeeldingen naast elkaar"
      },
      {
        ref:"drie afbeeldingen naast elkaar", /// niet aanpassen
        niceName:"drie afbeeldingen naast elkaar"
      },
      {
        ref:"vier afbeeldingen naast elkaar", /// niet aanpassen
        niceName:"vier afbeeldingen naast elkaar"
      },
      {
        ref:"vier afbeeldingen naast elkaar niet als achtergrond", /// niet aanpassen
        niceName:"vier afbeeldingen naast elkaar (niet als achtergrond en lager)"
      },
      {
        ref:"afbeelding en tekst drag and drop", /// niet aanpassen
        niceName:"afbeelding en tekst drag and drop"
      },
    ],
    content:{
      subtype:"gecentreerd",
      type:"image",
      content:"",
      dimensions:{},
      items:[{content:"",checked:false, id:uuid.v4(),position:{top:"0px",left:"0px"},dimensions:{width:"auto",height:"auto"}}],
      question:"",
      height:"450px",
      url:"",
      images:[],
    },
  },

  //// QUESTIONS
  {
    title:'Checkboxes', /// niet aanpassen
    niceName:"Checkboxes",
    icon:'fas fa-check',
    parentGroup:'questions',
    subtypes:[
      /*{
        ref:"checkboxes", /// niet aanpassen
        niceName:"checkboxes"
      },*/
      {
        ref:"checkboxes goed of fout", /// niet aanpassen
        niceName:"checkboxes"
      }],
    content:{
      subtype:"checkboxes",
      type:"question_checkboxes",
      content:"",
      items:[{content:"",checked:false, id:uuid.v4()}],
      question:"",
      url:"",
      images:[],
      must:false
    },
  },
  {
    title:'Selectielijst', /// niet aanpassen
    niceName:"Selectielijst",
    icon:'fas fa-bars',
    parentGroup:'questions',
    subtypes:[],
    content:{
      type:"select",
      content:"",
      items:[{content:"",checked:false, id:uuid.v4()}],
      question:"",
      url:"",
      images:[],
      must:false
    },
  },
  {
    title:'Radio', /// niet aanpassen
    niceName:"Meerkeuze vraag",
    icon:'far fa-check-circle',
    parentGroup:'questions',
    subtypes:[
      /*{
        ref:"radio", /// niet aanpassen
        niceName:"radio"
      },*/
      {
        ref:"radio goed of fout", /// niet aanpassen
        niceName:"Meerkeuzevraag"
      }],
    content:{
      subtype:"radio goed of fout",
      type:"question_radio",
      content:"",
      items:[{content:"",checked:false, id:uuid.v4()}],
      question:"",
      url:"",
      images:[],
      must:false
    },
  },
  {
    title:'Right or wrong', /// niet aanpassen
    niceName:"Goed of fout",
    icon:'far fa-times-circle',
    parentGroup:'questions',
    subtypes:[],
    content:{
      //subtype:"goed of fout",
      type:"question_right_or_wrong",
      content:"",
      items:[{content:"",checked:false, id:uuid.v4()}],
      question:"",
      url:"",
      images:[],
      must:false
    },
  },
  {
    title:'Open vraag',  /// niet aanpassen
    niceName:"Open vraag",
    icon:'far fa-question-circle',
    parentGroup:'questions',
    subtypes: [
      {
        ref:"tekstvlak", /// niet aanpassen
        niceName:"tekstvlak"
      },
      {
        ref:"tekstveld", /// niet aanpassen
        niceName:"tekstveld"
      }],
    content:{
      type:"question_open",
      subtype:"tekstvlak",
      content:"",
      items:[{content:"",checked:false, id:uuid.v4()}],
      question:"",
      url:"",
      images:[],
      must:false
    },
  },
  {
    title:'Matrix', /// niet aanpassen
    niceName:"Matrix",
    icon:'fas fa-table',
    parentGroup:'questions',
    subtypes: [
      {
        ref:"radio", /// niet aanpassen
        niceName:"radio"
      },
      {
        ref:"checkbox", /// niet aanpassen
        niceName:"checkbox"
      },
      {
        ref:"text", /// niet aanpassen
        niceName:"tekst"
      }],
    content:{
      subtype:"radio",
      type:"matrix",
      content:"",
      items:[],
      question:"",
      url:"",
      images:[],
      tableContent:[["","",""],[{id:uuid.v4(), cell_content:''}]],
      must:false,
      columns:3,
      rows:2,
    },
  },
  {
    title:'Slider', /// niet aanpassen
    niceName:"Slider",
    icon:'fas fa-sliders-h',
    parentGroup:'questions',
    subtypes: [],
    content:{
      type:"slider",
      content:"",
      items:[],
      question:"",
      url:"",
      images:[],
      must:false,
      min:'0',
      rangeMin:0,
      rangeMax:10,
      max:'10',
    },
  },
  {
    title:'Datepicker', /// niet aanpassen
    niceName:"Datumprikker",
    icon:'far fa-calendar-alt',
    parentGroup:'questions',
    subtypes: [],
    content:{
      type:"datepicker",
      content:"",
      items:[],
      question:"",
      url:"",
      images:[],
      must:false,
    },
  },
  ///SPECIAAL

  {
    title:'Speciaal', /// niet aanpassen
    niceName:"Speciaal",
    icon:'fas fa-crown',
    parentGroup:'special',
    subtypes:[
      {
        ref:"accordion", /// niet aanpassen
        niceName:"accordion"
      },
      {
        ref:"tabs", /// niet aanpassen
        niceName:"tabs"
      },
      {
        ref:"download bestand", /// niet aanpassen
        niceName:"download bestand"
      },
      {
        ref:"tabel", /// niet aanpassen
        niceName:"tabel"
      },
      {
        ref:"cards", /// niet aanpassen
        niceName:"Flip kaart"
      },
      {
        ref:"spreekballon", /// niet aanpassen
        niceName:"Spreekballon"
      },
    ],
    content:{
      subtype:"accordion",
      type:"special",
      content:"",
      items:[{content:"",checked:false, id:uuid.v4(), content2:'', flip:'front', buttonText:'',image:'',visible:true}],
      question:"",
      url:"",
      columns:3,
      rows:2,
      tableContent:[["","",""],["","",""]],
      images:[],
    },
  },
  {
    title:'Koppel terug', /// niet aanpassen
    niceName:"Koppel terug",
    icon:'fas fa-comment-dots',
    parentGroup:'special',
    subtypes:[  {
        ref:"feedback", /// niet aanpassen
        niceName:"feedback"
      },
      {
        ref:"herhaal antwoord", /// niet aanpassen
        niceName:"herhaal antwoord"
      }],
    content:{
      subtype:"feedback",
      type:"feedback",
      content:"",
      items:[],
      question:"",
      url:"",
      images:[],
    },
  },

  {
    title:'Charts', /// niet aanpassen
    niceName:"Charts",
    icon:'fas fa-chart-bar',
    parentGroup:'special',
    subtypes:[
      {
         ref:"staafdiagram", /// niet aanpassen
         niceName:"staafdiagram"
       },
       {
          ref:"grafiek", /// niet aanpassen
          niceName:"grafiek"
        },
        {
           ref:"cirkeldiagram", /// niet aanpassen
           niceName:"cirkeldiagram"
         }],
    content:{
      subtype:"staafdiagram",
      type:"chart",
      content:"",
      items:[
        {content:"item 1", id:uuid.v4(), value:"7"},
        {content:"item 2", id:uuid.v4(), value:"4"},
        {content:"item 3", id:uuid.v4(),value:"14"},
        {content:"item 4", id:uuid.v4(), value:"19"}],
      question:"",
      url:"",
      images:[],
    },
  },
  ///STRUCTURE
  {
    title:'Verdeler', /// niet aanpassen
    niceName:"Verdeler",
    icon:'fas fa-divide',
    parentGroup:'special',
    subtypes:[
      /*{
        ref:"begin sectie", /// niet aanpassen
        niceName:"begin sectie"
      },*/
      {
        ref:"einde pagina", /// niet aanpassen
        niceName:"einde pagina"
      }],
    content:{
      subtype:"einde pagina",
      type:"divider",
      content:"",
      items:[{content:"",checked:false, id:uuid.v4()}],
      question:"",
      url:"",
      images:[],
    },
  },
  //// FORM
  {
    title:'form', /// niet aanpassen
    niceName:"Formulier",
    icon:'fab fa-wpforms',
    parentGroup:'special',
    subtypes:[],
    content:{
      //subtype:"einde pagina",
      type:"form",
      content:"",
      items:[{content:"",checked:false, id:uuid.v4()}],
      question:"",
      url:"",
      images:[],
    },
  },
  //// GOAL
  {
    title:'goal', /// niet aanpassen
    niceName:"Doel",
    icon:'fas fa-bullseye',
    parentGroup:'special',
    subtypes:[],
    content:{
      //subtype:"einde pagina",
      type:"goal",
      content:"",
      items:[{content:"",checked:false, id:uuid.v4()}],
      question:"",
      url:"",
      images:[],
    },
  },
  //// CUSTOM MODULE
  {
    title:'custom', /// niet aanpassen
    niceName:"Custom module",
    icon:'fas fa-mouse',
    parentGroup:'special',
    subtypes:[],
    content:{
      //subtype:"einde pagina",
      type:"custom",
      content:"",
      items:[{content:"",checked:false, id:uuid.v4()}],
      question:"",
      url:"",
      images:[],
    },
  },

  //// IMPORT FROM WORDPRESS
  {
    title:appSettings.wordpress_import_name, /// niet aanpassen
    niceName:appSettings.wordpress_import_niceName,
    icon:appSettings.wordpress_import_icon,
    parentGroup:'special',
    subtypes:[],
    content:{
      //subtype:"einde pagina",
      type:"wordpress",
      post_id:"",
      content:"",
      items:[{content:"",checked:false, id:uuid.v4()}],
      question:"",
      url:"",
      images:[],
    },
  },

];

export {componentOptions};

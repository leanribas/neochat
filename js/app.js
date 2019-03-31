$(document).ready(function () {
    
    //foco no campo de digitação de mensagem pelo operador
    $(".write_msg").focus();
    
    
    var chat = new ChatClass();
    
    //inicia chat
    chat.init();

});
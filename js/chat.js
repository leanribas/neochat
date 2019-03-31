var ChatClass = function () {

    var self = this;

    //método para inicializar chat
    this.init = function () {

        this.addListeners();

        this.getDados();

    };

    //atribui aos elementos html as ações disparadas em eventos
    this.addListeners = function () {

        //envia mensagem para firebase ao clicar no botão 
        $(".msg_send_btn").on('click', function () {
            self.addMsg($(".write_msg").val(), 'n');
        });

        //envia mensagem para firebase ao pressionar enter no campo de mensagem 
        $(".write_msg").on('keypress', function (e) {
            if (e.which == 13) {
                self.addMsg($(".write_msg").val(), 'n');

            }
        });

    };

    //lê os dados do firebase
    this.getDados = function () {
        $.blockUI({
            message: "Buscando Chat..",
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .9,
                fontSize: "30px",
                color: '#fff'
            }});
        firebase.firestore().collection('mensagens').orderBy('data').onSnapshot(function (snapshot) {
            
            var changes = snapshot.docChanges();
            changes.forEach(function (change) {
                //console.log(change.doc.data());

                //se a mensagem for do atendente
                if (change.doc.data().tipo == 'n') {
                    $.unblockUI();
                    self.addMensagemNeogrid(change.doc.data().mensagem);
                } else {
                    $.unblockUI();
                    //mensagem do cliente
                    self.addMensagemClient(change.doc.data().mensagem);
                }
                
            });
        });
    };

    //adicionar mensagem do cliente na lista de mensagens
    this.addMensagemClient = function (msg) {

        var data = self.dataAtual();

        var html = '<div class="incoming_msg">'
                + '<div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>'
                + '<div class="received_msg">'
                + '<div class="received_withd_msg">'
                + '<p>' + msg + '</p>'
                + '<span class="time_date">' + data + '</span></div>'
                + '</div>'
                + '</div>';


        $(".msg_history").append(html);

        $(".write_msg").val("");

    };

    //adicionar mensagem do atendente na lista de mensagens
    this.addMensagemNeogrid = function (msg) {

        var data = self.dataAtual();

        var html = '<div class = "outgoing_msg">'
                + '<div class = "sent_msg" >'
                + '<p> ' + msg + ' </p>'
                + '<span class = "time_date"> ' + data + ' </span> </div>'
                + '</div>';

        $(".msg_history").append(html);

        $(".write_msg").val("");

        $(".msg_history").scrollTop(100000);

    };


    //adiciona nova mensagem no firebase
    this.addMsg = function (msg, tipo) {

        var data = new Date();

        firebase.firestore().collection('mensagens').add({mensagem: msg, tipo: tipo, data: data.getTime()}).catch(function (error) {
            console.error('Error writing new message to Firebase Database', error);
        });

    };

    this.dataAtual = function () {
        var now = new Date();
        return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    };

};

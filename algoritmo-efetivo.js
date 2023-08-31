algoritimoEfetivo =  (()=>{

    let editor;
    
    const palavrasEstilizar = ['var', 'nao', 'não', 'senão se','senao se', 'se',  'senao', ' E ', ' OU ', 'para', 'enquanto', 'faça', 'faca', 'avalie', 'caso', 'parar', 'padrao', 'padrão']

    const interpreta = ()=>{

        limpaLog();
        
        let algoritimo = this.editor.getDoc().getValue(); //document.getElementById('algoritimo').value;

        let codigo = algoritimo
                    .replace(/var /ig, 'let ')
                    .replace(/senao se\(/ig, 'else if(')
                    .replace(/senão se\(/ig, 'else if(')
                    .replace(/se\(/ig, 'if(')
                    .replace(/senao\{/ig, 'else{')
                    .replace(/senão{/ig, 'else{')
                    .replace(/avalie\(/ig, 'switch(')
                    .replace(/caso /ig, 'case ')
                    .replace(/parar;/ig, 'break;')
                    .replace(/padrao:/ig, 'default:')
                    .replace(/padrão:/ig, 'default:')
                    .replace(/ E /g, ' && ')
                    .replace(/ OU /g, ' || ')
                    .replace(/\para\(/ig, 'for(')
                    .replace(/\enquanto\(/ig, 'while(')
                    .replace(/\faça\(/ig, 'do(')
                    .replace(/\faca\(/ig, 'do(')
                    .replace(/\.paraCada\( /ig, 'forEach(')
                    .replace(/recebe\(/ig, 'prompt(')
                    .replace(/imprime\(/ig, 'algoritimoEfetivo.log(')
                    .replace(/alerta\(/ig, 'alert(')
                    .replace(/funcao /ig, 'function ')
                    .replace(/função /ig, 'function ')

        //FOR
        let novoCodigo = codigo;
        let iFor = codigo.indexOf('for(');
        let fFor = codigo.indexOf(')', iFor);
        while(iFor !=-1){
            let sub = codigo.substring(iFor+4);
            let iFim = sub.indexOf(')');

            sub = sub.substring(0,iFim);
            let dados = sub.split(' ');
            let novo = dados[1].replace('de','let '+dados[0]+'=');
            novo += dados[2]+";";
            novo += 'i<'+dados[4]+";";
            novo += dados[0]+'++';

            novoCodigo = codigo.substring(0,iFor) + 'for('+novo+')' + codigo.substring(fFor+1) ;

            iFor = codigo.indexOf('for(', iFor+4);
            fFor = codigo.indexOf(')', iFor);
        }
        codigo = novoCodigo;



        console.log(codigo);
        try {
            eval(codigo);
        } catch (error) {
            alert('falha no algoritimo.');
            console.log(error);
        }
        
    }

    const log = (valor)=>{
        let logAtual = document.getElementById('div_log').innerHTML;
        logAtual += '<br>'+ valor;
        document.getElementById('div_log').innerHTML = logAtual;
    }
    
    const limpaLog = ()=>{
        document.getElementById('div_log').innerHTML = '';
    }

    const salvaCodigo = ()=>{
        const  algoritimo =  this.editor.getDoc().getValue();
        let aluno = getAlunoLocal();
        aluno.codigos = aluno.codigos || {};
        aluno.codigos['algoritimo'] = algoritimo;
        fbService.salvaDados(aluno);
        setObjLocal('aluno', aluno);
        //localStorage.setItem('algoritimo', algoritimo);
    }

    const verificaDadosAluno = async ()=>{
        const aluno = getObjLocal('aluno');
        if(!aluno){
            let aluno = {};
            //aluno.email = prompt('E seu e-mail?');
            const { value: email } = await Swal.fire({
                title: 'Olá, qual seu e-mail?',
                input: 'email',
                //inputLabel: 'Seu e-mail',
                inputPlaceholder: 'Entre com seu e-mail'
              });
            aluno.email = email;
              
            
            fbService.getDados(aluno, async (alunoBase)=>{

                if(alunoBase){
                    aluno = alunoBase;
                    algoritimo = aluno.codigos['algoritimo'] || '//escreva seu primeiro algoritimo aqui';
                    this.editor.getDoc().setValue(algoritimo);
                    setObjLocal('aluno',aluno);
                    Swal.fire(
                        `Olá, ${aluno.nome}!`,
                        'Bem vindo de volta!',
                        'success'
                        )
                   // alert('Bem vindo de volta, '+aluno.nome);
                }else{
                    const { value: name } =   await Swal.fire({
                        title: 'Bem vindo ao algoritimo efetivo. Qual seu nome?',
                        input: 'text',
                        inputPlaceholder: 'Entre com seu e-mail'
                      });
                    
                    aluno.nome = name;
                    //aluno.nome = prompt('Bem vindo ao algoritimo efetivo. Qual seu nome?');
                    aluno.codigos = {};
                    aluno.codigos['algoritimo'] = '//escreva seu primeiro algoritimo aqui';
                    fbService.salvaDados(aluno, ()=>{
                        setObjLocal('aluno',aluno);
                        algoritimo = aluno.codigos['algoritimo'] || '//escreva seu primeiro algoritimo aqui';
                        this.editor.getDoc().setValue(algoritimo);
                    }, ()=>{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'nao foi possível salvar seus dados no momento. Mas ainda sim você pode editar algorítimos.'
                          })
                        //alert('Ops, nao foi possível salvar seus dados no momento. Mas ainda sim você pode editar algorítimos.');
                        algoritimo = aluno.codigos['algoritimo'] || '//escreva seu primeiro algoritimo aqui';
                        this.editor.getDoc().setValue(algoritimo);
                    });
                }
            }, ()=>{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'tivemos um problema ao tentar identificar você. Mas você ainda pode usar o editor, só que sem salvar seus dados.'
                  })
                //alert('Ops, tivemos um problema ao tentar identificar você. Mas você ainda pode usar o editor, só que sem salvar seus dados.');
                algoritimo = aluno.codigos['algoritimo'] || '//escreva seu primeiro algoritimo aqui';
                this.editor.getDoc().setValue(algoritimo);
            })
        }else{
            algoritimo = aluno.codigos['algoritimo'] || '//escreva seu primeiro algoritimo aqui';
            this.editor.getDoc().setValue(algoritimo);
        }
    }

    const getAlunoLocal = ()=>{
        return  getObjLocal('aluno');
    }

    const init = ()=>{
        const estilizar = {};
        palavrasEstilizar.forEach(x=>{
            estilizar[x.trim()] = 'style1';
            estilizar[x.toUpperCase().trim()] = 'style1';
        })
        
        this.editor = CodeMirror.fromTextArea(
        document.getElementById("algoritimo"), {
            mode: 'javascript',
            lineNumbers: true,
            theme: "dracula",
            keyword: estilizar
        });

        

        verificaDadosAluno();

        setInterval(salvaCodigo, 20000);

    }


    return {
        log, 
        interpreta,
        init 
    }

})();

const getObjLocal = (nome)=>{
    try {
        return JSON.parse(localStorage.getItem(nome));
    } catch (error) {
        return undefined;
    }
}

const setObjLocal = (nome, obj)=>{
    try {
        return  localStorage.setItem(nome, JSON.stringify(obj)) ;
    } catch (error) {
        return undefined;
    }
}

const alertSw = ()=>{
    
}


const fbService = (()=>{

    let app;

    const init = ()=>{
        const firebaseConfig = {
            apiKey: "AIzaSyBhqNCF9FTuMIOQKe9WC1LcRf7DOrwBaI4",
            authDomain: "algoritimo-efetivo.firebaseapp.com",
            projectId: "algoritimo-efetivo",
            storageBucket: "algoritimo-efetivo.appspot.com",
            messagingSenderId: "760804447992",
            appId: "1:760804447992:web:7b724a912547876f2d0d0d"
        };

        // Initialize Firebase
        this.app = firebase.initializeApp(firebaseConfig);
      
    }

    const getDados = (aluno, cbSuccess, cbError)=>{
        let firestore = firebase.firestore(); 
        const docRef = firestore.collection('alunos');
        
        docRef.doc(aluno.email).get().then(function(x) {
            console.log("documento lido!");
            cbSuccess(x.data());
          })
          .catch(function(error) {
              console.error("Erro lendo documento: ", error);
              cbError(error);
          });
    }

    const salvaDados = (aluno, cbSucesso, cbErro)=>{
        let fn = ()=>{};
        cbSucesso = cbSucesso || fn;
        cbErro = cbErro || fn;

        let firestore = firebase.firestore(); 
        const docRef = firestore.collection('alunos');
        docRef.doc(aluno.email).set(aluno).then(function(docRef) {
          console.log("Document successfully written!", docRef);
          cbSucesso(docRef);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
            cbErro(error);
        });
        
    }

    return {
        salvaDados,
        getDados,
        init
    }

})();

fbService.init();
algoritimoEfetivo.init();





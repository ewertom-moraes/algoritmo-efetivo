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
        localStorage.setItem('algoritimo', algoritimo);
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

        this.editor.getDoc().setValue((localStorage.getItem('algoritimo') || '//escreva seu primeiro algoritimo aqui'));

        setInterval(salvaCodigo, 5000);

    }


    return {
        log, 
        interpreta,
        init 
    }

})();

algoritimoEfetivo.init();





algoritimoEfetivo =  (()=>{

    console.log('carregou'); 


    let editor = CodeMirror.fromTextArea(
    document.getElementById("algoritimo"), {
        mode: 'javascript',
        lineNumbers: true,
        theme: "dracula",
        keyword: {
            "se": "style1",
            "para": "style1",
            "enquanto": "style1",
            "senão": "style1",
            "senao": "style1",
            "faca": "style1",
            "faça": "style1",
            "example\.com": "style2",
            "abc\\d+": "style2"
        }
    });

    editor.getDoc().setValue((localStorage.getItem('algoritimo') || 'teste'));

    const  algoritimo = localStorage.getItem('algoritimo');
    document.getElementById('algoritimo').value = algoritimo;

    const interpreta = ()=>{

        limpaLog();
        
        let algoritimo = editor.getDoc().getValue(); //document.getElementById('algoritimo').value;

        localStorage.setItem('algoritimo', algoritimo);

        let codigo = algoritimo
                    .replace(/var /ig, 'let ')
                    .replace(/se\(/ig, 'if(')
                    .replace(/senao\{/ig, 'else{')
                    .replace(/senão{/ig, 'else{')
                    .replace(/\para\(/ig, 'for(')
                    .replace(/\enquanto\(/ig, 'while(')
                    .replace(/\faça\(/ig, 'do(')
                    .replace(/\faca\(/ig, 'do(')
                    .replace(/\.paraCada\( /ig, 'forEach(')
                    .replace(/recebe\(/ig, 'prompt(')
                    .replace(/imprime\(/ig, 'algoritimoEfetivo.log(');

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

    return {
        log, 
        interpreta
    }

})();





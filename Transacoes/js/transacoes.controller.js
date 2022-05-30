angular.module("TransacoesModule").controller("TransacoesController", function ($scope) {
    var vm = $scope;
    vm.erroData = false;
    vm.erroTransacao = false;
    vm.dataAgendamento = new Date();

    //verificação e validacao da lista em memoria
    const transferencias = (JSON.parse(localStorage.getItem('list_transf') === null) ? [] : 
    JSON.parse(localStorage.getItem('list_transf')));
    vm.listaTransferencias = transferencias;
   
    vm.salvarTransferencia = function (novaTransferencia) {

        var taxaTranferencia = vm.definirTaxa(novaTransferencia);
        if (!vm.validarForm(novaTransferencia)) return;
        var transferencia ={
            contaOrigem : novaTransferencia.contaOrigem,
            contaDestino : novaTransferencia.contaDestino,
            valorTransacao : novaTransferencia.valorTransacao,
            dataTransferencia : vm.formatarDataFullTime(novaTransferencia.dataTransferencia),
            dataAgendamento :  vm.formatarDataFullTime(vm.dataAgendamento),
            taxaTranferencia: taxaTranferencia
        };


        transferencias.push(transferencia);
        console.log(transferencias);
        salvarLocalStorage();
        vm.limparTranferencia(novaTransferencia);
        
    }

    vm.validarForm = function(item){
        var dataTranf = vm.definirDiferencaData(item);
        if(dataTranf <-1){
           alert("Data de Transferência nao pode ser menor que hoje!!")
            return false;
        }
        if(item.valorTransacao <= 0){
            alert("Valor da Transação nao pode ser menor que hoje!!")
            return false;
        }

    }   

    vm.formatarDataFullTime = function(dataFullTime){
        var data = new Date(dataFullTime);
        dataFormatada = data.toLocaleDateString('pt-BR',{timeZone: 'UTC'})
        return dataFormatada;
    }
    vm.limparTranferencia = function(novaTransferencia){
        novaTransferencia.contaOrigem = "";
        novaTransferencia.contaDestino = "";
        novaTransferencia.valorTransacao = 0;
        novaTransferencia.dataTransferencia = '';
    }
    vm.definirDiferencaData = function(item){
        let dataAgendamento = vm.dataAgendamento;
        let dataTransferencia = new Date(item.dataTransferencia);
        var diff = moment(dataTransferencia,"DD/MM/YYYY HH:mm:ss").diff(moment(dataAgendamento,"DD/MM/YYYY HH:mm:ss"));
        var dias = moment.duration(diff).asDays();
        return  Math.round(dias);
    }
    vm.definirTaxa = function(item){
        var taxa = 0;
        var diferencaData = vm.definirDiferencaData(item);
        var valorTransacao = item.valorTransacao;
        //verificação de transferencias tipo A e D
        if(valorTransacao <=1000 || diferencaData <=1){
            return taxa = 3 +((valorTransacao*3)/100);
        }
        //verificação de transferencias tipo B e D
        if((valorTransacao >1000 && valorTransacao <=2000) || diferencaData <=10){
            return taxa = 12;
        }
        //verificação de transferencias tipo C e D
        vm.calcularTaxaD(diferencaData, valorTransacao);

        if(taxa === null || taxa === undefined){
            taxa = 0;
            alert("Taxa nao Aplicável");
        }

        return taxa;
    }  
    vm.calcularTaxaD = function(diferencaData, valorTransacao){
        if(valorTransacao > 2000){
            if(diferencaData > 10 && diferencaData <= 20){
                return taxa = (valorTransacao * 8.2) / 100;
            }
            if(diferencaData > 20 && diferencaData <= 30){
                return taxa = (valorTransacao * 6.9) / 100;
            }
            if(diferencaData > 30 && diferencaData <= 40){
                return taxa = (valorTransacao * 4.7) / 100;
            }
            if(diferencaData > 40){
                return taxa = (valorTransacao * 1.7) / 100;
            }
        }
    }
    function salvarLocalStorage(){
        localStorage.setItem("list_transf", JSON.stringify(transferencias));
    }

   
   
});
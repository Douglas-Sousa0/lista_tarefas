let lista_hoje = document.getElementById('lista-hoje')
let lista_semana = document.getElementById('lista-semana')
let lista_mais_semana = document.getElementById('lista-mais-semana')
let input_texto = document.getElementById('nome_tarefa')
let button_element = document.getElementById('botao-excluir')
let input_data = document.getElementById('data_tarefa')

let tarefas = JSON.parse(localStorage.getItem('@lista_tarefas')) || []

let data_atual = new Date()
let dia_data_atual = data_atual.getDate()
let mes_data_atual = data_atual.getMonth()
let ano_data_atual = data_atual.getFullYear()

let data_hoje = new Date(ano_data_atual, mes_data_atual, dia_data_atual).getTime() // valor para comparação

// ajustando pois quando o dia/mês é menor que 10 não há o 0 no início do número
// por exemplo: estará '2' em vez de '02'
if(dia_data_atual < 10){ 
    dia_data_atual = `0${dia_data_atual}`
} 

if(mes_data_atual < 10){
    mes_data_atual = `0${mes_data_atual}`
}

input_data.setAttribute('value',`${ano_data_atual}-${mes_data_atual + 1}-${dia_data_atual}`)
input_data.setAttribute('min', `${ano_data_atual}-${mes_data_atual + 1}-${dia_data_atual}`)


function adicionar_tarefas(){
    if(input_texto.value === ''){
        alert('Digite alguma tarefa')
    } 
    else{
        tarefas.push(`${input_texto.value} | ${input_data.value}`)
        input_texto.value = ''
        exibir_tarefas()
        salvar_dados()
    }
}

button_element.onclick = adicionar_tarefas

function exibir_tarefas(){
    lista_hoje.innerHTML = ''
    lista_semana.innerHTML = ''
    lista_mais_semana.innerHTML = ''

    tarefas.map((tarefa, posicao) => {
        let data_prazo = tarefa.split(' | ')[1]
        data_prazo = data_prazo.split('-')

        data_prazo = new Date(data_prazo[0], data_prazo[1] - 1, data_prazo[2]).getTime()

        let item_lista = document.createElement('li')
        let texto_tarefa = document.createTextNode(tarefa)

        let botao_excluir = document.createElement('a')
        botao_excluir.setAttribute('href', '#')

        let texto_excluir = document.createTextNode('🗑️')
        botao_excluir.appendChild(texto_excluir)
        botao_excluir.setAttribute('onclick', `deletar_tarefa(${posicao})`)

        item_lista.appendChild(texto_tarefa)
        item_lista.appendChild(botao_excluir)

        console.log(data_prazo - data_hoje)

        if(data_prazo === data_hoje){
            lista_hoje.appendChild(item_lista)
        } 
        else if(data_prazo - data_hoje > 0 && data_prazo - data_hoje <= 604800000){ // valor em milissegundos para 1 semana
            lista_semana.appendChild(item_lista)                            
        }
        else if(data_prazo - data_hoje > 604800000){
            lista_mais_semana.appendChild(item_lista)
        }
        else{
            return false // sem ação
        }
      
    })
}

exibir_tarefas()

function deletar_tarefa(posicao){
    tarefas.splice(posicao, 1)
    exibir_tarefas()
    salvar_dados()
}

function salvar_dados(){
    localStorage.setItem('@lista_tarefas', JSON.stringify(tarefas))
}
const canvas = document.querySelector("#canvas")
let ctx = canvas.getContext('2d')

const playing = document.querySelector(".playing")

let coluna
let linha 
let resolucao = 10

canvas.width = 900
canvas.height = 600

let width = canvas.width
let height = canvas.height

let grid;

let simulando = false
let clicando = false

function Array2D(i,j)
{
    let array = new Array(i)
    for (let x = 0; x < array.length; x++) {
        array[x] = new Array(j)
    }
    return array
}

function setUp()
{
    coluna = width/ resolucao
    linha = height/ resolucao

    grid = Array2D(coluna,linha)
    for(let i = 0; i< coluna; i++)
    {
        for(let j = 0; j< linha; j++)
        {
            grid[i][j] = 0
        }
    }
}

setUp()
DesenharCelulas()

canvas.addEventListener('mousedown',(e)=>{
    clicando = true
    ColocarCelulas(e)
})

canvas.addEventListener('mouseup',()=>{
    clicando = false
})

canvas.addEventListener('mousemove',(e)=>{
    if(clicando == true)
    {
        ColocarCelulas(e)
    }
})

document.addEventListener("keypress",(e)=>
{
    if(e.key == 'Enter')
    {
        if(simulando == false)
        {
            simulando = true
            Desenhar()
        }else if(simulando == true)
        {
            simulando = false
        }
    }
})

function Desenhar()
{
    DesenharCelulas()

    let next = Array2D(coluna,linha)
    
    for(let i = 0; i< coluna; i++)
    {
        for(let j = 0; j< grid.length; j++)
        {
            let vizinhos = verificarVizinhos(grid,i,j)

            let state = grid[i][j]

            if(state == 0 && vizinhos == 3)
            {
                next[i][j] = 1
            }else if(state == 1 && (vizinhos < 2 || vizinhos > 3))
            {
                next[i][j] = 0
            }else
            {
                next[i][j] = state
            }
        }
    }
    grid = next 
    if(simulando == true)
    {
        requestAnimationFrame(Desenhar)
    }
}

function DesenharCelulas()
{
    ctx.clearRect(0,0,width,height)
    ctx.fillStyle = '#000'
    ctx.fillRect(0,0,width,height)

    for(let i = 0; i< grid.length; i++)
    {
        for(let j = 0; j< grid.length; j++)
        {
            let x = i * resolucao
            let y = j * resolucao

            if (grid[i][j] == 1) {
                ctx.fillStyle = '#ff0'
            }
            if (grid[i][j] == 0) {
                ctx.fillStyle = '#00f'
            }
            // com linhas
            ctx.fillRect(x,y,resolucao-1,resolucao-1)
            // sem linhas
            // ctx.fillRect(x,y,resolucao,resolucao)
        }
    }
    playing.innerText = simulando? "playing":"stop"
}

function ColocarCelulas(e)
{
    let Xcol = (Math.floor(e.pageX / resolucao) - 1)
    let Ylin = (Math.floor(e.pageY / resolucao) - 1)
    if(grid[Xcol][Ylin] == 0)
    {
        grid[Xcol][Ylin] = 1
    }else if(grid[Xcol][Ylin] == 1)
    {
        grid[Xcol][Ylin] = 0
    }
    DesenharCelulas()
}

function verificarVizinhos(grid,x,y)
{
    let sum = 0
    for (let i = -1; i < 2; i++) 
    {
        for (let j = -1; j < 2; j++) 
        {
            let col = (x+i + coluna) % coluna
            let lin = (y+j + linha) % linha
            sum += grid[col][lin]   
        }   
    }
    sum -= grid[x][y]
    return sum
}
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useEffect } from "react"
import Swal from "sweetalert2"

//useEffect permite executar uma ideia de efeito colateral no sentido de, quando carregou a página, algo vai acontecer sem nenhuma ação do usuário

function App() {
  const { register, handleSubmit, reset, setFocus } = useForm()
  const [compras, setCompras] = useState([])
  const [total, setTotal] = useState(0)

  function adicionaProduto(data) {
    const compras2 = [...compras]
    compras2.push({ produto: data.produto, preco: Number(data.preco) }) //PRA ADICIONAR UM OBJETO, nome do campo e o conteúdo do campo, number pra no final ele somar como se fossem números e não strings
    setCompras(compras2)
    setFocus("produto") //determinado o foco no input que eu quero depois de adicionar um item
    reset({ produto: "", preco: "" }) //limpar um deterinado campo
    const total2 = total + Number(data.preco)
    setTotal(total2)
    localStorage.setItem("compras", JSON.stringify(compras2)) //pegar um objeto que é uma lista de atributos e valores e to jogando como se fosse um texto. É um método de conversão de dados semelhante ao Number()
    localStorage.setItem("total", total2) //pra salvar o item em localStorage no browser e atribuir um valor a essa variável
  }

  function removerLista() {
    Swal.fire({
      title: 'Quer mesmo excluir a lista de compras?',
      text: "Você não terá acesso novamente a essa lista futuramente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, quero excluir!',
      cancelButtonText: 'Não quero excluir'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("total")
        localStorage.removeItem("compras")
        Swal.fire(
          'Excluída',
          'Sua lista de compras foi excluída com sucesso',
          'success'
        ).then(() => {
          // Após o usuário clicar em "OK" e a notificação de sucesso ser fechada, a página será atualizada e nenhum item permanecerá no componente visual nem no localStorage
          window.location.reload()
        })
      }
    })
  }
  


  //executa programação quando algo acontece (no caso, quando o componente é renderizado)
  useEffect(() => {

    //se existem dados salvos em localStorage
    if (localStorage.getItem("compras")) {
      const compras2 = JSON.parse(localStorage.getItem("compras")) //converter para uma lista de objetos
      const total2 = Number(localStorage.getItem("total")) //vai buscar a informação que está na variável total toda vez que o componente for renderizado
      setCompras(compras2)
      setTotal(total2)
    }


    setFocus("produto") //pra focar no início do app, quando eu abro ele ou atualizo a página
  }, [])

  const listaCompras = compras.map(compra => (
    <h4 className="d-flex justify-content-between">
      <span>{compra.produto}</span>
      <span>R$ {compra.preco.toLocaleString("pt-br", { minimumFractionDigits: 2 })}</span> {/*isso serve pra formatar o número pra valor da moeda real e ficar certinho */}
    </h4>
  ))



  return (
    <div className="container-fluid">
      <nav class="navbar bg-info">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img src="./logo.png" alt="Logo"
              width="50" height="40" class="d-inline-block me-3" />
            App Controle de Compras
          </a>
        </div>
      </nav>
      <div className="container">
        <div className="row">
          <div className="col-sm-4">
            <img src="./super.jpg" alt="Super" className="img-fluid mt-3" />
          </div>
          <div className="col-sm-8">
            <form className="row mt-3" onSubmit={handleSubmit(adicionaProduto)}>
              <div className="col-md-6">
                <input type="text" placeholder="Produto" className="form-control form-control-lg" {...register("produto")} required />
              </div>
              <div className="col-md-3">
                <input type="number" placeholder="Preço R$" className="form-control form-control-lg" {...register("preco")} required step={0.01} min="0.00" /> {/* step quer dizer de quanto em quanto o valor vai pular */}
              </div>
              <div className="col-md-3 d-grid">
                <input type="submit" value="Adicionar" className="btn btn-primary btn-lg" />
              </div>
            </form>
            <div class="card text-center mt-3 w-100 mx-auto">
              <div class="card-header">
                <h3 className="text-start">Lista dos Produtos Adicionados</h3>
              </div>
              <div class="card-body text-primary">
                {listaCompras}
              </div>
              <div class="card-footer">
                <h4 className="d-flex justify-content-between">
                  <span>Total Previsto</span>
                  <span>R$: {total.toLocaleString("pt-br", { minimumFractionDigits: 2 })}</span>
                </h4>
              </div>
            </div>
            <button type="reset" value="excluir" className="btn btn-danger btn-lg mt-3" onClick={removerLista}>Excluir Lista</button>
          </div>
        </div>
      </div>
    </div>

  )
}

export default App

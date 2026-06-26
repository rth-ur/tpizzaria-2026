<template>
  <div>
    <div id="pedidos-tabela">
      <div>
        <div id="pedidos-tabela-cabecalho">
          <div id="ordem-id">#ID</div>
          <div>Nome</div>
          <div>Pizza</div>
          <div>Massa</div>
          <div>Opcionais</div>
          <div>Status</div>
          <div id="div-acoes">Ações</div>
        </div>
      </div>
    </div>

    <div
      class="pedidos-tabela-linha"
      v-for="pedido in listaPedidosRealizados"
      :key="pedido.id"
    >
      <div id="ordem-numero">{{ pedido.id }}</div>
      <div>{{ pedido.nome }}</div>
      <div>{{ pedido.pizza.nome }}</div>
      <div>{{ pedido.massa.descricao }}</div>
      <div>
        <ul>
          <li v-for="(complemento, index) in pedido.complemento" :key="index">
            {{ complemento.nome }}
          </li>
        </ul>
        <div class="divider"></div>
        <ul>
          <li v-for="(bebida, index) in pedido.bebidas" :key="index">
            {{ bebida.nome }}
          </li>
        </ul>
      </div>
      <div>
        <select
          @change="atualizarStatusPedido($event, pedido.id)"
          name="status"
          class="status"
        >
          <option value="">Selecione</option>
          <option
            v-for="status in listaStatusPedido"
            :key="status.id"
            :value="status.id"
            :selected="status.id == pedido.statusId"
          >
            {{ status.descricao }}
          </option>
        </select>
      </div>
      <div id="div-acoes">
        <img
          @click="deletarPedido(pedido.id)"
          :src="iconeLixeira"
          width="35px"
          height="35px"
        />
      </div>
    </div>
  </div>
</template>
<script>
import iconeLixeira from '@/assets/icone_lixeira.png';

export default {
  name: "ListaPedidoComponent",
  data() {
    return {
      listaPedidosRealizados: [],
      listaStatusPedido: [],
      iconeLixeira,
      pollingInterval: null,
    };
  },
  methods: {
    async consultarPedidos() {
      try {
        const response = await fetch(`${this.$apiUrl}/pedidos`);
        this.listaPedidosRealizados = await response.json();
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    },
    async consultarStatusPedido() {
      const response = await fetch(`${this.$apiUrl}/status_pedido`);
      this.listaStatusPedido = await response.json();
    },
    async atualizarStatusPedido(event, idPedido) {
      const idPedidoAtualizado = event.target.value;
      const atualizacaoJson = JSON.stringify({ statusId: idPedidoAtualizado });
      await fetch(`${this.$apiUrl}/pedidos/${idPedido}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: atualizacaoJson,
      });
      // Atualizar listagem imediatamente
      this.consultarPedidos();
    },
    async deletarPedido(idPedido) {
      if (confirm("Deseja deletar este pedido?")) {
        try {
          const response = await fetch(`${this.$apiUrl}/pedidos/${idPedido}`, {
            method: "DELETE",
          });
          if (response.ok) {
            // Re-renderizar imediatamente
            this.listaPedidosRealizados = this.listaPedidosRealizados.filter(
              (p) => p.id !== idPedido
            );
          }
        } catch (error) {
          console.error("Erro ao deletar pedido:", error);
        }
      }
    },
    iniciarPolling() {
      // Polling a cada 5 segundos
      this.pollingInterval = setInterval(() => {
        this.consultarPedidos();
      }, 5000);
    },
    pararPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }
    },
  },
  mounted() {
    this.consultarPedidos();
    this.consultarStatusPedido();
    this.iniciarPolling();
  },
  beforeUnmount() {
    this.pararPolling();
  },
};
</script>
<style scoped>
#pedidos-tabela {
  width: 100%;
  margin: 0 auto;
}

#pedidos-tabela-cabecalho,
#pedidos-tabela-linhas,
.pedidos-tabela-linha {
  display: flex;
  flex-wrap: wrap;
}

#pedidos-tabela-cabecalho {
  font-weight: bold;
  padding: 12px;
  border-bottom: 2px solid #222;
}

#pedidos-tabela-cabecalho div,
.pedidos-tabela-linha div {
  width: 18%;
}

.pedidos-tabela-linha {
  width: 100%;
  padding: 12px;
  border-bottom: 1px dotted #222;
}

#pedidos-tabela-cabecalho #ordem-id,
.pedidos-tabela-linha #ordem-numero,
.pedidos-tabela-linha #div-acoes,
#pedidos-tabela-cabecalho #div-acoes {
  width: 5%;
}
</style>

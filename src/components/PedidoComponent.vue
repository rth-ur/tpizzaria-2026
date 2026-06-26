<template>
  <div>
    <!-- Sistema de Alertas Semânticos -->
    <div class="alerts-container">
      <div v-if="alertas.length > 0">
        <div
          v-for="(alerta, idx) in alertas"
          :key="idx"
          :class="['alerta', `alerta-${alerta.tipo}`]"
        >
          {{ alerta.mensagem }}
        </div>
      </div>
    </div>

    <form id="pedido-form" @submit="criarPedido($event)">
      <div>
        <p id="nome-pizza-content">
          {{ pizza && pizza.nome ? pizza.nome : "--" }}
        </p>
        <img
          id="foto-content"
          :src="pizza && pizza.foto ? pizza.foto : ''"
        />
      </div>
      <div class="inputs" id="form-pedido">
        <label>Nome <span class="obrigatorio">*</span></label>
        <input
          v-model="nomeCliente"
          type="text"
          placeholder="Digite seu Nome"
          id="nome-cliente"
          required
          @blur="validarNome"
          :class="{ 'input-error': erros.nome }"
        />
        <span v-if="erros.nome" class="erro-mensagem">{{ erros.nome }}</span>
      </div>
      <div class="inputs">
        <label>Tipo de massa <span class="obrigatorio">*</span></label>
        <select
          v-model="tipoMassaSelecionado"
          name="tipo-massa"
          id="tipo-massa"
          required
          @change="validarMassa"
          :class="{ 'input-error': erros.massa }"
        >
          <option value="" selected>Selecione o tipo de massa</option>
          <option
            v-for="tipoMassa in listaTiposMassa"
            :key="tipoMassa.id"
            :value="tipoMassa"
          >
            {{ tipoMassa.descricao }}
          </option>
        </select>
        <span v-if="erros.massa" class="erro-mensagem">{{ erros.massa }}</span>
      </div>
      <div class="inputs">
        <label id="opcionais-titulo"> Selecione os opcionais</label>
        <label id="opcionais-subtitulo"> Selecione os adicionais</label>

        <div
          v-for="complemento in listaComplementos"
          :key="complemento.id"
          class="checkbox-container"
        >
          <input
            type="checkbox"
            :name="complemento.nome"
            :value="complemento"
            v-model="listaComplementosSelecionados"
          />
          <span>{{ complemento.nome }}</span>
        </div>

        <label>Adicione uma bebida</label>

        <div
          v-for="bebida in listaBebidas"
          :key="bebida.id"
          class="checkbox-container"
        >
          <input
            type="checkbox"
            :name="bebida.nome"
            :value="bebida"
            v-model="listaBebidasSelecionadas"
          />
          <span>{{ bebida.nome }}</span>
        </div>

        <div class="inputs">
          <input 
            type="submit" 
            class="submit-btn" 
            value="Confirmar Pedido"
            :disabled="!podeEnviar"
            :class="{ 'submit-btn-disabled': !podeEnviar }"
          />
        </div>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  name: "PedidoComponent",
  props: {
    pizza: null,
  },
  data() {
    return {
      listaTiposMassa: [],
      listaComplementos: [],
      listaBebidas: [],
      nomeCliente: "",
      tipoMassaSelecionado: "",
      listaComplementosSelecionados: [],
      listaBebidasSelecionadas: [],
      erros: {
        nome: null,
        massa: null,
      },
      alertas: [],
    };
  },
  computed: {
    podeEnviar() {
      return this.nomeCliente.trim() !== "" && this.tipoMassaSelecionado !== "";
    },
  },
  methods: {
    validarNome() {
      if (!this.nomeCliente.trim()) {
        this.erros.nome = "Nome é obrigatório";
      } else if (this.nomeCliente.trim().length < 3) {
        this.erros.nome = "Nome deve ter pelo menos 3 caracteres";
      } else {
        this.erros.nome = null;
      }
    },
    validarMassa() {
      if (!this.tipoMassaSelecionado) {
        this.erros.massa = "Tipo de massa é obrigatório";
      } else {
        this.erros.massa = null;
      }
    },
    adicionarAlerta(mensagem, tipo = "info") {
      this.alertas.push({ mensagem, tipo });
      setTimeout(() => {
        this.alertas.shift();
      }, 4000);
    },
    async getTiposMassa() {
      const response = await fetch(`${this.$apiUrl}/tipos_massa`);
      const dados = await response.json();
      this.listaTiposMassa = dados;
    },
    async getOpcionais() {
      const response = await fetch(`${this.$apiUrl}/opcionais`);
      const dados = await response.json();
      this.listaComplementos = dados.complemento;
      this.listaBebidas = dados.bebidas;
    },
    async criarPedido(e) {
      e.preventDefault();

      // Validar campos obrigatórios
      this.validarNome();
      this.validarMassa();

      if (this.erros.nome || this.erros.massa) {
        this.adicionarAlerta("Preencha todos os campos obrigatórios", "erro");
        return;
      }

      const dadosPedido = {
        nome: this.nomeCliente,
        massa: this.tipoMassaSelecionado,
        bebidas: Array.from(this.listaBebidasSelecionadas),
        complemento: Array.from(this.listaComplementosSelecionados),
        pizza: this.pizza,
        statusId: 5,
      };

      console.log(dadosPedido);

      try {
        const dadosJson = JSON.stringify(dadosPedido);
        const req = await fetch(`${this.$apiUrl}/pedidos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: dadosJson,
        });

        if (req.ok) {
          this.adicionarAlerta("Pedido confirmado com sucesso!", "sucesso");
          // Limpar form
          this.nomeCliente = "";
          this.tipoMassaSelecionado = "";
          this.listaComplementosSelecionados = [];
          this.listaBebidasSelecionadas = [];
          this.erros = { nome: null, massa: null };

          // Redirecionar para listagem de pedidos após 1.5s
          setTimeout(() => {
            this.$router.push("/pedidos");
          }, 1500);
        } else {
          this.adicionarAlerta("Erro ao confirmar pedido. Tente novamente.", "erro");
        }
      } catch (error) {
        this.adicionarAlerta("Erro ao conectar com o servidor.", "erro");
        console.error(error);
      }
    }
  },
  mounted() {
    this.getTiposMassa();
    this.getOpcionais();
  },
};
</script>

<style scoped>
#foto-content {
  margin-bottom: 16px;
  border-radius: 16px;
  position: relative;
  z-index: -1;
  justify-content: center;
  width: 100%;
  height: 180px;
  object-fit: cover;
}

#nome-pizza-content {
  font-size: 43px;
  font-weight: bold;
  text-align: start;
  margin-bottom: -90px;
  margin-left: 40px;
  color: antiquewhite;
  padding: 16px;
}

#form-pedido {
  max-width: 750px;
  margin: 0 auto;
}

.inputs {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

label {
  font-weight: bold;
  margin-bottom: 16px;
  color: #222;
  padding: 5px 12px;
  flex-direction: start;
  display: flex;
  border-left: 4px solid #c0392b;
}

input,
select {
  padding: 12px;
  width: 300px;
  border: solid #222 1px;
  border-radius: 8px;
  height: 20px;
  font-size: 12px;
}

select {
  height: 45px;
}

#opcionais-titulo {
  width: 100%;
}

#opcionais-subtitulo {
  display: flex;
  align-items: flex-start;
  align-content: center;
  width: 100%;
  margin-bottom: 12px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.checkbox-container input {
  width: 18px;
  height: 18px;
}

.checkbox-container span {
  margin-left: 6px;
  font-weight: bold;
}

.submit-btn {
  background-color: #222;
  color: #c0392b;
  font-weight: bold;
  border: none;
  font-size: 18px;
  border-radius: 12px;
  padding: 16px;
  margin: 0 auto;
  cursor: pointer;
  width: 100%;
  height: auto;
  transition: 0.5s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #c0392b;
  color: white;
}

/* Alertas Semânticos */
.alerts-container {
  margin-bottom: 20px;
}

.alerta {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  font-weight: bold;
  animation: slideIn 0.3s ease-in;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alerta-erro {
  background-color: #fee;
  border-left: 4px solid #c0392b;
  color: #c0392b;
}

.alerta-sucesso {
  background-color: #efe;
  border-left: 4px solid #27ae60;
  color: #27ae60;
}

.alerta-aviso {
  background-color: #ffebd6;
  border-left: 4px solid #f39c12;
  color: #d68910;
}

.alerta-info {
  background-color: #e3f2fd;
  border-left: 4px solid #3498db;
  color: #2c3e50;
}

/* Validação de Campos */
.obrigatorio {
  color: #c0392b;
  margin-left: 4px;
}

.input-error {
  border-color: #c0392b !important;
  background-color: #fef9f9;
}

.erro-mensagem {
  color: #c0392b;
  font-size: 12px;
  margin-top: 4px;
}

/* Botão Desabilitado */
.submit-btn-disabled {
  background-color: #bdc3c7;
  color: #7f8c8d;
  cursor: not-allowed;
  opacity: 0.6;
}

.submit-btn-disabled:hover {
  background-color: #bdc3c7;
  color: #7f8c8d;
}
</style>

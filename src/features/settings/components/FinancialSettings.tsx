"use client";

import { useState, useEffect } from "react";
import { Wallet, Key, Plus, Trash2, Copy } from "lucide-react";
import { SelectField, SettingsCard, SectionHeader, SaveButton, useSave } from "./settingsUi";

export function FinancialSettings() {
  const [closing, setClosing] = useState("ultimo_dia");
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: "Integração Banco X",
      key: "sk_live_4Xk9••••••••••3mQp",
      created: "12/04/2025",
    },
    {
      id: 2,
      name: "ERP Interno",
      key: "sk_live_7Lp2••••••••••9nWr",
      created: "01/03/2025",
    },
  ]);
  const [categories, setCategories] = useState([
    "Receita Operacional",
    "Despesas Administrativas",
    "Folha de Pagamento",
    "Tecnologia",
    "Marketing",
    "Impostos",
  ]);
  const [newCat, setNewCat] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("@contaup:financial_prefs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.closing) setClosing(parsed.closing);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.apiKeys) setApiKeys(parsed.apiKeys);
      } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("@contaup:financial_prefs", JSON.stringify({ closing, categories, apiKeys }));
  };

  const { state, save } = useSave(handleSave);

  const addCategory = () => {
    if (newCat.trim()) {
      setCategories([...categories, newCat.trim()]);
      setNewCat("");
    }
  };
  const removeCategory = (i: number) =>
    setCategories(categories.filter((_, idx) => idx !== i));
  const removeKey = (id: number) =>
    setApiKeys(apiKeys.filter((k) => k.id !== id));

  return (
    <SettingsCard>
      <SectionHeader
        icon={Wallet}
        title="Configurações Financeiras"
        subtitle="Categorias, ciclo contábil e integrações via API"
      />
      <SelectField
        label="Ciclo de Fechamento"
        value={closing}
        onChange={setClosing}
        options={[
          { label: "Último dia do mês", value: "ultimo_dia" },
          { label: "Dia 15 de cada mês", value: "dia_15" },
          { label: "Dia 1 de cada mês", value: "dia_1" },
          { label: "Personalizado", value: "custom" },
        ]}
      />
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-6 mb-3">
        Categorias Padrão
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        {categories.map((c, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl"
            style={{ background: "#242424", color: "#d1d5db" }}
          >
            {c}
            <button
              onClick={() => removeCategory(i)}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 size={11} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
          placeholder="Nova categoria..."
          className="flex-1 px-4 py-2.5 rounded-2xl text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-[#10b981]/50"
          style={{ background: "#242424" }}
        />
        <button
          onClick={addCategory}
          className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-white hover:opacity-80 transition-opacity cursor-pointer"
          style={{ background: "#10b981" }}
        >
          <Plus size={15} />
        </button>
      </div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-6 mb-3">
        Integrações — API Keys
      </p>
      <div className="flex flex-col gap-2 mb-3">
        {apiKeys.map((k) => (
          <div
            key={k.id}
            className="flex items-center justify-between px-4 py-3 rounded-2xl"
            style={{ background: "#242424" }}
          >
            <div>
              <p className="text-xs font-semibold text-white">{k.name}</p>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                {k.key}
              </p>
              <p className="text-[10px] text-gray-600 mt-0.5">
                Criado em {k.created}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-7 h-7 rounded-xl flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
                style={{ background: "#10b98118" }}
              >
                <Copy size={12} color="#10b981" />
              </button>
              <button
                onClick={() => removeKey(k.id)}
                className="w-7 h-7 rounded-xl flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
                style={{ background: "#f4375418" }}
              >
                <Trash2 size={12} color="#f43754" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          const newKey = {
            id: Date.now(),
            name: "Nova Chave API",
            key: `sk_live_${Math.random().toString(36).substr(2, 9)}••••••••••${Math.random().toString(36).substr(2, 4)}`,
            created: new Date().toLocaleDateString('pt-BR')
          };
          setApiKeys([...apiKeys, newKey]);
        }}
        className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-2xl hover:opacity-70 transition-opacity cursor-pointer"
        style={{ background: "#10b98118", color: "#10b981" }}
      >
        <Key size={13} /> Gerar nova API Key
      </button>
      <SaveButton state={state} onClick={save} />
    </SettingsCard>
  );
}

// ─────────────────────────────────────────────────────────────
// SEÇÃO 6 — LGPD / PROTEÇÃO DE DADOS

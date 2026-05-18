-- Função reutilizada pelos dois triggers
CREATE OR REPLACE FUNCTION set_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tabela: clientes
CREATE TABLE clientes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  nome          text NOT NULL,
  email         text,
  telefone      text,
  empresa       text,
  status        text DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  notas         text,
  criado_em     timestamptz DEFAULT now(),
  atualizado_em timestamptz DEFAULT now(),
  UNIQUE (user_id, email)
);

CREATE TRIGGER trg_clientes_atualizado_em
  BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE INDEX ON clientes(user_id);

-- Tabela: deals
CREATE TABLE deals (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo        text NOT NULL,
  cliente_id    uuid REFERENCES clientes(id) ON DELETE SET NULL,
  valor         NUMERIC(12,2) CHECK (valor IS NULL OR valor >= 0),
  etapa         text DEFAULT 'Lead'
                  CHECK (etapa IN ('Lead', 'Qualificado', 'Proposta', 'Negociação', 'Fechado')),
  notas         text,
  criado_em     timestamptz DEFAULT now(),
  atualizado_em timestamptz DEFAULT now()
);

CREATE TRIGGER trg_deals_atualizado_em
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE INDEX ON deals(cliente_id);
CREATE INDEX ON deals(etapa);
CREATE INDEX ON deals(user_id);

-- RLS: clientes
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "isolamento_por_usuario" ON clientes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS: deals
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "isolamento_por_usuario" ON deals
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

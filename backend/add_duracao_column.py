#!/usr/bin/env python3
"""
Script para adicionar a coluna duracao_minutos à tabela execucao_treino
"""

import sqlite3
import os

def main():
    # Caminho para o banco de dados
    db_path = "fittracker.db"
    
    if not os.path.exists(db_path):
        print(f"Erro: Banco de dados {db_path} não encontrado.")
        return
    
    try:
        # Conectar ao banco
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar se a coluna já existe
        cursor.execute("PRAGMA table_info(execucao_treino)")
        columns = [row[1] for row in cursor.fetchall()]
        
        if 'duracao_minutos' in columns:
            print("Coluna duracao_minutos já existe na tabela execucao_treino.")
        else:
            # Adicionar a coluna
            cursor.execute("ALTER TABLE execucao_treino ADD COLUMN duracao_minutos INTEGER")
            conn.commit()
            print("Coluna duracao_minutos adicionada com sucesso à tabela execucao_treino.")
        
        # Verificar a estrutura final da tabela
        cursor.execute("PRAGMA table_info(execucao_treino)")
        columns_info = cursor.fetchall()
        
        print("\nEstrutura atual da tabela execucao_treino:")
        for col in columns_info:
            print(f"  {col[1]} ({col[2]}) - {col[4] if col[4] else 'NULL'}")
        
        conn.close()
        
    except sqlite3.Error as e:
        print(f"Erro ao modificar o banco de dados: {e}")
    except Exception as e:
        print(f"Erro inesperado: {e}")

if __name__ == "__main__":
    main()
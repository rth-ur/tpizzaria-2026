import { supabase } from './supabaseClient'

const isDev = import.meta.env.MODE === 'development'
const API_URL = isDev ? 'http://localhost:3000' : import.meta.env.VITE_API_URL || '/api'

/**
 * Fetch dados de uma tabela/endpoint
 * Em dev: JSON Server | Em prod: Supabase
 */
async function fetchData(endpoint) {
    try {
        if (isDev) {
            // JSON Server (desenvolvimento)
            const res = await fetch(`${API_URL}/${endpoint}`)
            if (!res.ok) throw new Error(`Erro: ${res.status}`)
            return res.json()
        } else {
            // Supabase (produção)
            const { data, error } = await supabase
                .from(endpoint)
                .select('*')
            if (error) throw new Error(error.message)
            return data
        }
    } catch (error) {
        console.error(`Erro ao buscar ${endpoint}:`, error)
        throw error
    }
}

/**
 * Criar novo registro
 */
async function createData(endpoint, payload) {
    try {
        if (isDev) {
            // JSON Server
            const res = await fetch(`${API_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            if (!res.ok) throw new Error(`Erro: ${res.status}`)
            return res.json()
        } else {
            // Supabase
            const { data, error } = await supabase
                .from(endpoint)
                .insert([payload])
                .select()
            if (error) throw new Error(error.message)
            return data[0]
        }
    } catch (error) {
        console.error(`Erro ao criar em ${endpoint}:`, error)
        throw error
    }
}

/**
 * Atualizar registro por ID
 */
async function updateData(endpoint, id, payload) {
    try {
        if (isDev) {
            // JSON Server
            const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            if (!res.ok) throw new Error(`Erro: ${res.status}`)
            return res.json()
        } else {
            // Supabase
            const { data, error } = await supabase
                .from(endpoint)
                .update(payload)
                .eq('id', id)
                .select()
            if (error) throw new Error(error.message)
            return data[0]
        }
    } catch (error) {
        console.error(`Erro ao atualizar ${endpoint}/${id}:`, error)
        throw error
    }
}

/**
 * Deletar registro por ID
 */
async function deleteData(endpoint, id) {
    try {
        if (isDev) {
            // JSON Server
            const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
                method: 'DELETE'
            })
            if (!res.ok) throw new Error(`Erro: ${res.status}`)
            return true
        } else {
            // Supabase
            const { error } = await supabase
                .from(endpoint)
                .delete()
                .eq('id', id)
            if (error) throw new Error(error.message)
            return true
        }
    } catch (error) {
        console.error(`Erro ao deletar ${endpoint}/${id}:`, error)
        throw error
    }
}

/**
 * Real-time: Subscribe para atualizações em tempo real (Supabase only)
 */
function subscribeToTable(endpoint, callback) {
    if (!isDev) {
        return supabase
            .from(endpoint)
            .on('*', payload => {
                callback(payload)
            })
            .subscribe()
    }
    return null
}

export { fetchData, createData, updateData, deleteData, subscribeToTable }

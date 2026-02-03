import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string, username: string, fullName: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, username: string, fullName: string) => {
        try {
            setLoading(true);

            // Create auth user
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                        full_name: fullName
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                // Create profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        username,
                        full_name: fullName,
                        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
                    });

                if (profileError) throw profileError;

                toast.success('Conta criada com sucesso!');
            }
        } catch (error: any) {
            console.error('Error signing up:', error);
            toast.error(error.message || 'Erro ao criar conta');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            toast.success('Login realizado com sucesso!');
        } catch (error: any) {
            console.error('Error signing in:', error);
            toast.error(error.message || 'Erro ao fazer login');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            toast.success('Logout realizado com sucesso!');
        } catch (error: any) {
            console.error('Error signing out:', error);
            toast.error('Erro ao fazer logout');
        }
    };

    const value = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

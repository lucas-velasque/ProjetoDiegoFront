'use client';

import { useState, useEffect, useRef } from 'react';
import { cartasApi } from '@/lib/api/cartas';
import { Carta } from '@/types';

interface CardSelectorProps {
  value: number | null;
  onChange: (cartaId: number, carta: Carta) => void;
  disabled?: boolean;
}

export default function CardSelector({ value, onChange, disabled }: CardSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState<Carta[]>([]);
  const [selectedCard, setSelectedCard] = useState<Carta | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch cards when search term changes
  useEffect(() => {
    const fetchCards = async () => {
      if (searchTerm.length < 2 && searchTerm.length > 0) return;

      setLoading(true);
      try {
        const response = await cartasApi.getAll({
          nome: searchTerm || undefined,
          limit: 20,
          page: 1,
        });
        setCards(response.data || []);
      } catch (error) {
        console.error('Erro ao buscar cartas:', error);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchCards, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // Load initial selected card if value is provided
  useEffect(() => {
    const loadSelectedCard = async () => {
      if (value && !selectedCard) {
        try {
          const carta = await cartasApi.getById(value);
          setSelectedCard(carta);
          setSearchTerm(carta.nome);
        } catch (error) {
          console.error('Erro ao carregar carta selecionada:', error);
        }
      }
    };

    loadSelectedCard();
  }, [value, selectedCard]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCard = (carta: Carta) => {
    setSelectedCard(carta);
    setSearchTerm(carta.nome);
    setIsOpen(false);
    onChange(carta.id, carta);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);

    // Clear selection if input is cleared
    if (!newValue) {
      setSelectedCard(null);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Carta Pokémon *
      </label>

      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Digite o nome da carta para buscar..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={disabled}
          required
        />

        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {selectedCard && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && searchTerm && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {cards.length > 0 ? (
            <ul>
              {cards.map((carta) => (
                <li
                  key={carta.id}
                  onClick={() => handleSelectCard(carta)}
                  className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedCard?.id === carta.id ? 'bg-blue-100' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {carta.imagem_url && (
                      <img
                        src={carta.imagem_url}
                        alt={carta.nome}
                        className="w-12 h-16 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{carta.nome}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {carta.elemento && (
                          <span className="inline-block bg-gray-100 px-2 py-0.5 rounded text-xs mr-2">
                            {carta.elemento}
                          </span>
                        )}
                        {carta.raridade && (
                          <span className="inline-block bg-gray-100 px-2 py-0.5 rounded text-xs">
                            {carta.raridade}
                          </span>
                        )}
                      </div>
                      {carta.descricao && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {carta.descricao}
                        </div>
                      )}
                    </div>
                    {carta.preco_medio && (
                      <div className="text-sm font-medium text-green-600">
                        R$ {Number(carta.preco_medio).toFixed(2)}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2">Nenhuma carta encontrada</p>
              <p className="text-xs mt-1">Tente buscar por outro nome</p>
            </div>
          )}
        </div>
      )}

      {/* Selected card preview */}
      {selectedCard && !isOpen && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            {selectedCard.imagem_url && (
              <img
                src={selectedCard.imagem_url}
                alt={selectedCard.nome}
                className="w-16 h-20 object-cover rounded border border-gray-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div className="flex-1">
              <div className="font-medium text-gray-900">{selectedCard.nome}</div>
              <div className="text-sm text-gray-600 mt-1">
                ID: {selectedCard.id} • {selectedCard.elemento} • {selectedCard.raridade}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

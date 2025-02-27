import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, CircularProgress, Chip, Box, TextField } from "@mui/material";

const CountrySelector = ({ selectedCountries, setSelectedCountries }) => {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch("https://restcountries.com/v3.1/all");
                const data = await response.json();

                const countryList = data
                    .map((c) => ({
                        name: c.translations.tur?.common || c.name.common, // Türkçe varsa onu kullan
                        code: c.cca2 // Ülke kodu (TR, US, DE vb.)
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name));

                setCountries(countryList);
                setLoading(false);
            } catch (error) {
                console.error("Ülkeler yüklenirken hata oluştu:", error);
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    const handleChange = (event) => {
        setSelectedCountries(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <FormControl fullWidth>
            <InputLabel>Hedef Kitle Konumunu Seçin</InputLabel>
            <Select
                multiple
                value={selectedCountries}
                onChange={handleChange}
                label="Hedef Kitle Konumunu Seçin"
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((code) => {
                            const country = countries.find((c) => c.code === code);
                            return country ? <Chip key={code} label={country.name} /> : null;
                        })}
                    </Box>
                )}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 200,
                            overflow: 'auto',
                        },
                    },
                }}
            >
                <TextField
                    value={search}
                    onChange={handleSearchChange}
                    label="Ülke Ara"
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: 2, marginTop: 2 }}
                />
                {loading ? (
                    <MenuItem disabled>
                        <CircularProgress size={20} />
                        Yükleniyor...
                    </MenuItem>
                ) : (
                    filteredCountries.map((c) => (
                        <MenuItem key={c.code} value={c.code}>
                            {c.name}
                        </MenuItem>
                    ))
                )}
            </Select>
        </FormControl>
    );
};

export default CountrySelector;

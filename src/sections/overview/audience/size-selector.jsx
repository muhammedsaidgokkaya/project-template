import React, { useEffect, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Slider, Typography } from "@mui/material";

const LookalikeSizeSelector = ({ ratios, setRatios, audienceCount, setAudienceCount }) => {
    useEffect(() => {
        const predefinedSelections = {
            1: [1, 2],
            2: [1, 2, 3],
            3: [1, 2, 3, 4],
            4: [1, 2, 3, 4, 5],
            5: [1, 2, 3, 4, 5, 6],
            6: [1, 2, 3, 4, 5, 6, 7]
        };
        setRatios(predefinedSelections[audienceCount] || [2]);
    }, [audienceCount]);

    return (
        <Box>
            <Typography variant="subtitle1" fontWeight="bold">
                Hedef Kitle Büyüklüğünü Seçin
            </Typography>

            <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel>Benzer Hedef Kitle Sayısı</InputLabel>
                <Select value={audienceCount} onChange={(e) => setAudienceCount(e.target.value)} label="Benzer Hedef Kitle Sayısı">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                        <MenuItem key={num} value={num}>
                            {num}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Slider
                value={ratios}
                onChange={(e, newValues) => setRatios(newValues)}
                min={1}
                max={10}
                step={1}
                marks={[
                    { value: 1, label: "1%" },
                    { value: 2, label: "2%" },
                    { value: 3, label: "3%" },
                    { value: 4, label: "4%" },
                    { value: 5, label: "5%" },
                    { value: 6, label: "6%" },
                    { value: 7, label: "7%" },
                    { value: 8, label: "8%" },
                    { value: 9, label: "9%" },
                    { value: 10, label: "10%" }
                ]}
                sx={{
                    mt: 5, 
                    width: 'calc(100% - 30px)',
                    marginLeft: '20px',
                    marginRight: '20px', 
                }}
            />
        </Box>
    );
};

export default LookalikeSizeSelector;

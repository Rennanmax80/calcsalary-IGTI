const INSS_TABLE = [
    {
        id: 1,
        minValue: 0,
        maxValue: 1045,
        difference: 1045 - 0,
        discountPercentage: 0.075,
        discountValue: -1,
    },
    {
        id: 2,
        minValue: 1045.01,
        maxValue: 2089.6,
        difference: 2089.6 - 1045,
        discountPercentage: 0.09,

    },
    {
        id: 3,
        minValue: 2089.61,
        maxValue: 3134.4,
        difference: 3134.4 - 2089.6,
        discountPercentage: 0.12,
    },

    {
        id: 4,
        minValue: 3134.41,
        maxValue: 6101.06,
        difference: 6101.06 - 3134.4,
        discountPercentage: 0.14,

    },
];

function round(value){
    return +value.toFixed(2);

}

function calculateDiscountINSS(baseINSS){
    let discountINSS = 0;

    if (baseINSS > 6101.07){
        return 713.1;
    }

    for (var i = 0; i < INSS_TABLE.length; i++){
        var currentItem = INSS_TABLE[i];
        let discountValue = 0;
    
        if(baseINSS > currentItem.maxValue){
            discountValue = round(currentItem.difference * currentItem.discountPercentage);
    
            discountINSS += discountValue;
        }else{
            discountValue = round((baseINSS - currentItem.minValue) * currentItem.discountPercentage);
    
            discountINSS += discountValue;
            break;
        }
    }

    discountINSS = round(discountINSS);

    return discountINSS;
}

function calculateDiscountIRPF(baseIRPF){
    let discountIRPF = baseIRPF < 1903.98
    ? 0
    : baseIRPF < 2826.65
    ? round(baseIRPF * 0.075) - 142.8
    : baseIRPF < 3751.05
    ? round(baseIRPF * 0.15) - 354.8
    : baseIRPF < 4664.68
    ? round(baseIRPF * 0.225) - 636.13
    : round(baseIRPF * 0.275) - 869.36;

    discountIRPF = round(discountIRPF);

    return discountIRPF;
}

function calculateSalaryFrom(fullSalary){
    const baseINSS = fullSalary;
    const discountINSS = calculateDiscountINSS(baseINSS);

    const baseIRPF = baseINSS - discountINSS;
    const discountIRPF = calculateDiscountIRPF(baseIRPF);

    const netSalary = baseINSS - discountINSS - discountIRPF;

    return{
        baseINSS,
        discountINSS,
        baseIRPF,
        discountIRPF,
        netSalary,
    };

}

function calculatePercentualFrom(fullSalary, discountINSS, discountIRPF, netSalary) {
    const percentNetSalary = getPercent(netSalary, fullSalary);
    const percentINSS = getPercent(discountINSS, fullSalary);
    const percentIRPF = getPercent(discountIRPF, fullSalary);

    return{
        percentINSS,
        percentIRPF,
        percentNetSalary,

    };
}


const optionCurrency = { style: 'currency', currency: 'BRL' };
const optionPercentage = {
    style: 'percent',
    minimumFractionDigits: 2
}

function formatCurrency(value){
    const formatter = new Intl.NumberFormat("pt-BR", optionCurrency);
    return formatter.format(value);
}

function getPercent(value, fullSalary) {
    return((value / fullSalary) * 100);
}

function formatPercent(value){
    const formatter = new Intl.NumberFormat("pt-BR", optionPercentage);
    return formatter.format(value / 100);
}

export { calculateSalaryFrom, formatCurrency, calculatePercentualFrom, formatPercent};
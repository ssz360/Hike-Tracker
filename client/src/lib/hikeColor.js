const colors=['#f5400a','#274e13','#ffcc61','#333333','#1f3754','#45818e','#6a329f','#660000']

const getColor=id=>{
    return colors[(id-1)%colors.length];
}

export default getColor;
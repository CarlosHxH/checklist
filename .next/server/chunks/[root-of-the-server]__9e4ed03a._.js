module.exports = {

"[project]/.next-internal/server/app/api/v2/dashboard/barchart/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}}),
"[project]/src/prisma.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "prisma": (()=>prisma)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
const __TURBOPACK__default__export__ = prisma;
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}}),
"[project]/src/utils/index.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/utils/index.ts
/**
 * Retorna as datas de início e fim para os últimos 30 dias
 * @returns Objeto com startDate (data inicial) e endDate (data atual)
 */ __turbopack_context__.s({
    "CSVExporter": (()=>CSVExporter),
    "fileToBase64": (()=>fileToBase64),
    "filterInspections": (()=>filterInspections),
    "formatDate": (()=>formatDate),
    "formatDateShort": (()=>formatDateShort),
    "getBase64": (()=>getBase64),
    "getDaysInMonth": (()=>getDaysInMonth),
    "getFullYear": (()=>getFullYear),
    "getLast30Days": (()=>getLast30Days),
    "getLast30DaysLabels": (()=>getLast30DaysLabels)
});
function getLast30Days() {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // Fim do dia atual
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 29); // 30 dias atrás (incluindo hoje)
    startDate.setHours(0, 0, 0, 0); // Início do dia
    return {
        startDate,
        endDate
    };
}
function formatDateShort(date) {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}
function getLast30DaysLabels() {
    const { startDate } = getLast30Days();
    const labels = [];
    for(let i = 0; i < 30; i++){
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        labels.push(formatDateShort(date));
    }
    return labels;
}
function getFullYear() {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear + 1, 0, 1);
    return {
        startDate,
        endDate
    };
}
async function fileToBase64(file) {
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // Fallback for mime type
        const mimeType = 'type' in file ? file.type : 'application/octet-stream';
        return `data:${mimeType};base64,${buffer.toString('base64')}`;
    } catch (error) {
        console.error('Error converting file to base64:', error);
        throw error;
    }
}
async function getBase64(file) {
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = ()=>{
            resolve(reader.result);
        };
        reader.onerror = reject;
    });
}
function getDaysInMonth(month = new Date().getMonth() + 1, year = new Date().getFullYear()) {
    const date = new Date(year, month, 0);
    const monthName = date.toLocaleDateString("pt-BR", {
        month: "short"
    });
    const daysInMonth = date.getDate();
    const days = [];
    let i = 1;
    while(days.length < daysInMonth){
        days.push(`${monthName} ${i}`);
        i += 1;
    }
    return days;
}
function filterInspections(obj, searchTerm) {
    const results = [];
    function recursiveSearch(current, path = []) {
        // Se for null ou undefined, retorna
        if (current === null || current === undefined) return;
        // Se for string, verifica se inclui o termo buscado
        if (typeof current === "string") {
            if (current.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push([
                    ...path,
                    current
                ].join(" > "));
            }
            return;
        }
        // Se for array, percorre cada elemento
        if (Array.isArray(current)) {
            current.forEach((item, index)=>{
                recursiveSearch(item, [
                    ...path,
                    `[${index}]`
                ]);
            });
            return;
        }
        // Se for objeto, percorre suas propriedades
        if (typeof current === "object") {
            Object.entries(current).forEach(([key, value])=>recursiveSearch(value, [
                    ...path,
                    key
                ]));
        }
    }
    recursiveSearch(obj);
    return results || obj;
}
function formatDate(date, format = 'yyyy-MM-dd') {
    if (typeof date === 'string') date = new Date(date);
    const pad = (num)=>num.toString().padStart(2, '0');
    return format.replace('yyyy', date.getFullYear().toString()).replace('yy', date.getFullYear().toString().slice(2)).replace('MM', pad(date.getMonth() + 1)).replace('dd', pad(date.getDate())).replace('HH', pad(date.getHours())).replace('mm', pad(date.getMinutes())).replace('ss', pad(date.getSeconds()));
}
class CSVExporter {
    static formatDate(date, format = 'yyyy-MM-dd') {
        const pad = (num)=>num.toString().padStart(2, '0');
        return format.replace('yyyy', date.getFullYear().toString()).replace('MM', pad(date.getMonth() + 1)).replace('dd', pad(date.getDate())).replace('HH', pad(date.getHours())).replace('mm', pad(date.getMinutes())).replace('ss', pad(date.getSeconds()));
    }
    static formatValue(value) {
        if (value === null || value === undefined) return '';
        if (value instanceof Date) return this.formatDate(value);
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }
    /**
   * Exports array of objects to CSV
   */ static export(data, options = {}) {
        const { filename = `export_${this.formatDate(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`, delimiter = ';', headers, dateFormat } = options;
        if (!data.length) {
            console.warn('No data to export');
            return;
        }
        // Get headers from first object if not provided
        const csvHeaders = headers || Object.keys(data[0]);
        // Create CSV content
        const csvContent = [
            // Headers row
            csvHeaders.join(delimiter),
            // Data rows
            ...data.map((item)=>csvHeaders.map((header)=>{
                    const value = item[header];
                    // Format date if dateFormat is provided
                    if (value instanceof Date && dateFormat) {
                        return this.formatDate(value, dateFormat);
                    }
                    // Escape values containing delimiter or quotes
                    const formattedValue = this.formatValue(value);
                    if (formattedValue.includes(delimiter) || formattedValue.includes('"')) {
                        return `"${formattedValue.replace(/"/g, '""')}"`;
                    }
                    return formattedValue;
                }).join(delimiter))
        ].join('\n');
        // Create and download file
        const blob = new Blob([
            csvContent
        ], {
            type: 'text/csv;charset=utf-8;'
        });
        const link = document.createElement('a');
        /*
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
      return;
    }*/ const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
} /*
// Example usage:
interface User {
  id: number;
  name: string;
  email: string;
  birthDate: Date;
  active: boolean;
  metadata?: Record<string, any>;
}
/*
// Example data
const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    birthDate: new Date('1990-05-15'),
    active: true,
    metadata: { role: 'admin' }
  },
  // ... more users
];
/*
// Basic usage
CSVExporter.exportToCSV(users);

// Advanced usage with options
CSVExporter.exportToCSV(users, {
  filename: 'users_export.csv',
  delimiter: ';',
  headers: ['ID', 'Name', 'Email', 'Birth Date', 'Status', 'Metadata'],
  dateFormat: 'dd/MM/yyyy'
});*/ 
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/api/v2/dashboard/barchart/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
async function getInspectionsByPlate() {
    const { startDate, endDate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFullYear"])();
    // Buscar todas as inspeções do ano atual
    const inspections = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].inspection.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lt: endDate
            }
        },
        select: {
            id: true,
            vehicleId: true,
            createdAt: true,
            vehicle: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
    // Agrupar inspeções por placa
    const groupedByPlate = inspections.reduce((acc, inspection)=>{
        if (!acc[inspection.vehicle.plate]) {
            acc[inspection.vehicle.plate] = {
                inspections: [],
                lastId: inspection.vehicleId
            };
        }
        acc[inspection.vehicle.plate].inspections.push({
            ...inspection,
            plate: inspection.vehicle.plate,
            created_at: inspection.createdAt
        });
        return acc;
    }, {});
    // Transformar no formato desejado
    const result = Object.entries(groupedByPlate).map(([plate, data])=>{
        // Inicializar array com 12 meses zerados
        const monthlyCount = Array(12).fill(0);
        // Contar inspeções por mês
        data.inspections.forEach((inspection)=>{
            const month = inspection.created_at.getMonth();
            monthlyCount[month]++;
        });
        return {
            id: data.lastId,
            label: plate,
            data: monthlyCount,
            stack: 'A'
        };
    });
    return result;
}
async function GET(request) {
    try {
        const data = await getInspectionsByPlate();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data, {
            status: 201
        });
    } catch (error) {
        console.error("Error fetching inspections:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch inspections"
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__9e4ed03a._.js.map
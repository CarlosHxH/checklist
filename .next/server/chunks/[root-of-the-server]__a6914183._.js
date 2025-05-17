module.exports = {

"[project]/.next-internal/server/app/api/v1/viagens/[id]/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/src/app/api/v1/viagens/inspection.service.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createInspectionWithTransaction": (()=>createInspectionWithTransaction)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/prisma.ts [app-route] (ecmascript)");
;
async function createInspectionWithTransaction(validatedData) {
    const { id, ...data } = validatedData;
    try {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction(async (tx)=>{
            // 1. Create the inspection record
            const inspection = await tx.inspection.create({
                data: {
                    userId: data.userId,
                    vehicleId: data.vehicleId,
                    status: data.status,
                    kilometer: data.kilometer,
                    crlvEmDia: data.crlvEmDia,
                    certificadoTacografoEmDia: data.certificadoTacografoEmDia,
                    nivelAgua: data.nivelAgua,
                    nivelOleo: data.nivelOleo,
                    avariasCabine: data.avariasCabine,
                    descricaoAvariasCabine: data.descricaoAvariasCabine,
                    bauPossuiAvarias: data.bauPossuiAvarias,
                    descricaoAvariasBau: data.descricaoAvariasBau,
                    funcionamentoParteEletrica: data.funcionamentoParteEletrica,
                    descricaoParteEletrica: data.descricaoParteEletrica,
                    extintor: data.extintor,
                    dianteira: data.dianteira,
                    descricaoDianteira: data.descricaoDianteira,
                    tracao: data.tracao,
                    descricaoTracao: data.descricaoTracao,
                    truck: data.truck,
                    descricaoTruck: data.descricaoTruck,
                    quartoEixo: data.quartoEixo,
                    descricaoQuartoEixo: data.descricaoQuartoEixo,
                    isFinished: true,
                    photos: {
                        create: data?.photos ? data.photos?.map((photo)=>({
                                photo: photo.photo,
                                type: photo.type,
                                description: photo.description
                            })) : []
                    }
                }
            });
            let inspect;
            if (data.status === "INICIO") {
                // For START inspections:
                // Find the most recent open inspection for this vehicle and user or create a new one
                const openInspection = await tx.inspect.findUnique({
                    where: {
                        id,
                        userId: data.userId,
                        vehicleId: data.vehicleId,
                        endId: null
                    }
                });
                if (openInspection) {
                    // Update existing inspection with new startId
                    inspect = await tx.inspect.update({
                        where: {
                            id: openInspection.id
                        },
                        data: {
                            startId: inspection.id
                        }
                    });
                } else {
                    // Create new Inspect
                    inspect = await tx.inspect.create({
                        data: {
                            userId: data.userId,
                            vehicleId: data.vehicleId,
                            startId: inspection.id
                        }
                    });
                }
            } else if (data.status === "FINAL") {
                // For END inspections:
                // Try to find an open inspection to update
                const openInspection = await tx.inspect.findFirst({
                    where: {
                        userId: data.userId,
                        vehicleId: data.vehicleId,
                        startId: {
                            not: null
                        },
                        endId: null
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                if (openInspection) {
                    // Update with endId
                    inspect = await tx.inspect.update({
                        where: {
                            id: openInspection.id
                        },
                        data: {
                            endId: inspection.id
                        }
                    });
                } else {
                    // Create new with just endId
                    inspect = await tx.inspect.create({
                        data: {
                            userId: data.userId,
                            vehicleId: data.vehicleId,
                            endId: inspection.id
                        }
                    });
                }
            }
            return {
                inspection,
                inspect
            };
        });
    } catch (error) {
        console.error("Transaction failed:", error);
        throw error;
    }
}
}}),
"[project]/src/app/api/v1/viagens/[id]/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$v1$2f$viagens$2f$inspection$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/v1/viagens/inspection.service.ts [app-route] (ecmascript)");
;
;
;
;
async function GET(request, { params }) {
    try {
        const id = (await params).id;
        const inspections = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].inspect.findUnique({
            where: {
                id
            },
            include: {
                vehicle: {
                    select: {
                        id: true,
                        model: true,
                        plate: true,
                        eixo: true
                    }
                },
                start: true,
                end: true
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(inspections);
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(error);
    }
}
async function POST(request, { params }) {
    try {
        const id = (await params).id;
        const formData = await request.formData();
        const data = {};
        // Process all form fields
        for (const [key, value] of formData.entries()){
            if (key === 'photos') {
                // Handle multiple photos
                if (!data.photos) data.photos = [];
                // Check if value is a File or Blob
                if (value instanceof Blob) {
                    const base64 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fileToBase64"])(value);
                    data.photos.push({
                        photo: base64,
                        type: 'vehicle',
                        description: `Veiculo foto-${data.photos.length + 1}`
                    });
                }
            } else {
                // Handle regular form fields
                data[key] = value;
            }
        }
        // Convert isFinished to boolean
        data.isFinished = true;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$v1$2f$viagens$2f$inspection$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createInspectionWithTransaction"])({
            id,
            ...data
        });
        //const result = await createInspectionWithTransaction(body);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result, {
            status: 201
        });
    } catch (error) {
        console.error('Error creating inspection:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create inspection',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
} /*
async function createInspectionWithTransaction({ data, id }: { data: any, id: string }) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Crie o registro de inspeção
      const inspection = await tx.inspection.create({ data });
      // Crie o grupo de registro de inspeção
      const inspect = await tx.inspect.upsert({
        where: {
          id: id ?? 'dummy-id',
          ...(inspection.vehicleId ? {} : {}),
        },
        create: {
          userId: data.userId,
          ...(data.status === "INICIO"
            ? { startId: inspection.id }
            : { endId: inspection.id }),
        },
        update: {
          userId: data.userId,
          ...(data.status === "INICIO"
            ? { startId: inspection.id }
            : { endId: inspection.id }),
        },
      })
      return { inspection, inspect }
    })
    return result
  } catch (error) {
    console.error('Transaction failed:', error)
    throw error
  }
}*/ 
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__a6914183._.js.map
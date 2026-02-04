import express from 'express';
console.log('Type of express:', typeof express);
try {
    const app = express();
    console.log('App created:', !!app);
    console.log('Type of app.get:', typeof app.get);
    console.log('Type of app.listen:', typeof app.listen);
} catch (e) {
    console.error('Error creating app:', e);
}

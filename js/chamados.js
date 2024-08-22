document.getElementById('chamadoForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const chamado = {
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        sistema: document.getElementById('sistema').value,
        anexo: document.getElementById('anexo').value
    };

    let chamados = JSON.parse(localStorage.getItem('chamados')) || [];
    chamados.push(chamado);
    localStorage.setItem('chamados', JSON.stringify(chamados));

    alert('Chamado enviado com sucesso!');
    this.reset();
});


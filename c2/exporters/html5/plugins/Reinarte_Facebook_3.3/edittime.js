function GetPluginSettings()
{
	return {
		"name":			"Reinarte Facebook",
		"id":			"Reinarte_Facebook",
		"version":		"3.3 - 09/06/2017",
		"description":	"Logar Conta do Facebook, Publicar e Compartilhar.",
		"author":		"Elmer Nancher",
		"help url":		"http://reinarte.com.br",
		"category":		"Reinarte",
		"type":			"object",
		"rotatable":	false,
		"cordova-plugins":	"cordova-plugin-facebook4",
		"flags":		0
						| pf_singleglobal
		,"dependency": "modal.css;channel.html"											
	};
};
AddCondition(0, cf_trigger, "Login Sucesso", "Login", "No Login com Sucesso", "Ativado quando o usuário efetuar login com sucesso.", "OnLoginSucceeded");
AddCondition(1, cf_trigger, "Login Falhou", "Login", "No Login se Falhar", "Ativado quando o login do usuário falhar.", "OnLoginFailed");
AddCondition(2, cf_trigger, "Deslogar Sucesso", "Login", "Em Deslogar com Sucesso", "Ativado quando o usuário deslogar.", "OnLogoutSucceeded");
AddCondition(3, cf_trigger, "Deslogar Falhou", "Login", "Em Deslogar se Falhar", "Ativado quando o usuário NÃO conseguir deslogar.", "OnLogoutFailed");
AddCondition(4,	0, "Está Logado", "Login", "Está Logado", "Verdadeiro enquanto o usuário estiver logado no Facebook.", "IsLogined");
AddCondition(5, cf_trigger, "Postagem Sucesso", "Postagem e Publicação", "Na Postagem Enviada", "Quando a postagem for enviada para o Facebook.", "OnPromptWallPostLinkSucceeded");
AddCondition(6, cf_trigger, "Postagem Falhou", "Postagem e Publicação", "A Postagem Falhou", "Quando a postagem NÃO for enviada.", "OnPromptWallLinkPostFailed");
AddCondition(7, cf_trigger, "Publicação Sucesso", "Postagem e Publicação", "Na Publicação Enviada", "Quando a publicação for enviada para o Facebook.", "OnPublishWallPostLinkSucceeded");
AddCondition(8, cf_trigger, "Publicação Falhou", "Postagem e Publicação", "A Publicação Falhou", "Quando a publicação NÃO for enviada.", "OnPublishWallPostLinkFailed");
AddCondition(9, cf_trigger, "Publicar Recorde Sucesso", "Ranking", "Na Publicação do Recorde.", "Quando a publicação do recorde for enviada.", "OnPublishScoreSucceeded");
AddCondition(10, cf_trigger, "Publicar Recorde Falhou", "Ranking", "A Publicação do Recorde Falhou", "Quando o recorde NÃO for enviado.", "OnPublishScoreFailed");
AddCondition(11, cf_none, "Exibindo Ranking", "Ranking", "Está Exibindo Ranking", "Quando o ranking estiver sendo visualizado.", "IsShowingLeaderboard");
AddCondition(12, cf_trigger, "Requisição Recorde Sucesso", "Ranking", "Recorde Recebido Sucesso", "Quando o recorde for recebido.", "OnRequestHighScoreSucceeded");
AddCondition(13, cf_trigger, "Requisição Recorde Falhou", "Ranking", "Recorde Não Recebido", "Quando o recorde NÃO for recebido.", "OnRequestHighScoreFailed");
AddCondition(14, cf_trigger, "Convite Sucesso", "Convite", "No Convite Sucesso", "Quando o convite foi enviado.", "OnInviteSucceeded");
AddCondition(15, cf_trigger, "Convite Falhou", "Convite", "Se Convite Falhou", "Quando o convite NÃO foi enviado.", "OnInviteFailed");

AddStringParam("Permissões", "As Permissões ex: \"email, public_profile, user_friends\"", "\"email, public_profile, user_friends\"");
AddAction(0, 0, "Logar", "Login", "Logar Facebook", "Entrar com uma conta do Facebook no aplicativo.", "Login");
AddAction(1, 0, "Deslogar", "Login", "Deslogar Facebook", "Sair da conta Facebook no aplicativo.", "Logout");
AddStringParam("URL", "O Link para Compartilhar. ex:) \"https://play.google.com/store/apps/details?id=com.reinarte.multiplayergames\"", "\"\"");
AddStringParam("Nome (opcional)", "O Texto do Link. ex:) \"Reinarte Multiplayer Games\"", "\"\"");
AddStringParam("Descrição (opcional)", "A descrição que aparece abaixo da legenda na caixa de diálogo Compartilhar. ex) \"Jogos Multiplayer de Raciocínio e Extatégia.\"", "\"\"");
AddStringParam("Legenda (opcional)", "A legenda aparece abaixo do nome na caixa de diálogo Compartilhar. ex) \"Desafiando seu raciocínio e seu amigos.\"", "\"\"");
AddStringParam("Imagem URL (opcional)", "A URL da imagem para usar na caixa de diálogo Compartilhar. ex) \"http://reinarte.com.br/rmg/logo.png\"", "\"\"");
AddAction(2, 0, "Fazer Postagem (com diálogo)", "Postagem e Publicação", "Fazer a Postagem", "Escreva uma postagem para compartilhar com seus amigos em sua linha do tempo.", "PromptWallPostLink");
AddStringParam("Mensagem", "O Texto para a publiação. ex:) \"Vamos jogar este jogo.\"", "\"\"");
AddStringParam("URL", "O Link para Compartilhar. ex:) \"https://play.google.com/store/apps/details?id=com.reinarte.multiplayergames\"", "\"\"");
AddStringParam("Nome (opcional)", "O Texto do Link. ex:) \"Reinarte Multiplayer Games\"", "\"\"");
AddStringParam("Descrição (opcional)", "A descrição que aparece abaixo da legenda na caixa de diálogo Compartilhar. ex) \"Jogos Multiplayer de Raciocínio e Extatégia.\"", "\"\"");
AddStringParam("Legenda (opcional)", "A legenda aparece abaixo do nome na caixa de diálogo Compartilhar. ex) \"Desafiando seu raciocínio e seu amigos.\"", "\"\"");
AddStringParam("Imagem URL (opcional)", "A URL da imagem para usar na caixa de diálogo Compartilhar. ex) \"http://reinarte.com.br/rmg/logo.png\"", "\"\"");
AddAction(3, 0, "Fazer Publicação (sem diálogo)", "Postagem e Publicação", "Fazer a Publicação", "Publicar o link e o texto com seus amigos em sua linha do tempo.", "PublishWallPostLink");
AddNumberParam("Recorde", "O Recorde do jogador para enviar.");
AddAction(4, 0, "Enviar Recorde", "Ranking", "Enviar este Recorde <b>{0}</b>", "Enviar o recorde deste jogador..", "PublishScore");
AddAction(5, af_none, "Mostrar Ranking", "Ranking", "Exibir Ranking", "Abrir o Ranking atual.", "ShowLeaderboard");
AddAction(6, af_none, "Fechar Ranking", "Ranking", "Ocultar Ranking", "Fechar o Ranking aberto.", "HideLeaderboard");
AddAction(7, 0, "Requisitar Recorde", "Ranking", "Requisitar o Recorde", "Requisita Meu Recorde.", "RequestHighScore");
AddAction(8, 0, "Convidar", "Convite", "Convide", "Convidar amigos.", "Invite");

AddExpression(0, ef_return_number, "Usuario ID", "Login", "Meu_ID", "ID do usuário neste aplicativo.");
AddExpression(1, ef_return_string, "Nome Completo", "Login", "Nome_Todo", "Nome completo do usuário.");
AddExpression(2, ef_return_string, "Primeiro Nome", "Login", "Primeiro_Nome", "Primeiro nome do usuário.");
AddExpression(3, ef_return_string, "Ultimo Nome", "Login", "Ultimo_Nome", "Ultimo nome do usuário.");
AddExpression(4, ef_return_string, "Genero", "Login", "Genero", "Genero do usuário (Masculino ou Feminino).");
AddExpression(5, ef_return_string, "Meu Email", "Facebook", "Email", "Email da conta do usuário.");
AddExpression(6, ef_return_string, "Token Acesso", "Facebook", "Token_Acesso", "Token gerado pela API do Facebook");
AddExpression(7, ef_return_string, "Localidade", "Facebook", "Localidade", "País registrado na conta do usuário.");
AddStringParam("ID", "ID para Imagem do Usuario.");
AddExpression(8, ef_return_string, "Imagem URL pela ID", "Facebook", "URL_Imagem", "URL da imagem do usuário pela ID da conta.");
AddExpression(9, ef_return_number, "Meu Recorde", "Ranking", "Recorde", "O recorde do usuário logado.");
AddExpression(10, ef_return_string, "Erro Mensagem", "Erro", "Erro_Mensagem", "Mensagem de erro.");
ACESDone();

var property_list = [
 	new cr.Property(ept_text,		"Chave Secreta",	"",			"Sua Chave Secreta no Facebook pra este aplicativo."),
	new cr.Property(ept_text,		"ID Aplicativo",	"",			"A ID do Aplicativo no Facebook Developer."),
	new cr.Property(ept_text,		"Nome Aplicativo",	"",			"O Nome do Aplicativo no Facebook Developer."),
	];
function CreateIDEObjectType()
{
	return new IDEObjectType();
}
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	this.instance = instance;
	this.type = type;
	this.properties = {};
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}
IDEInstance.prototype.OnInserted = function()
{
}
IDEInstance.prototype.OnDoubleClicked = function()
{
}
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}
IDEInstance.prototype.Draw = function(renderer)
{
}
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}
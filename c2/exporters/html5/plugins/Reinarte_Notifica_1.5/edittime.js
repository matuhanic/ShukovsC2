function GetPluginSettings()
{
	return {
		"name":			"Reinarte Notifica",
		"id":			"Reinarte_Notifica",
		"version":		"1.5 - 28/04/2018",
		"description":	"Mensagens de Notificação.",
		"author":		"Elmer Nancher",
		"help url":		"https://www.scirra.com/forum/plugin-notifications_t85061",
		"category":		"Reinarte",
		"type":			"object",
		"rotatable":	false,
		"flags":		0| pf_singleglobal,
        "dependency":	"jquery.gritter.js;jquery.gritter.css"
	};
};
// Conditions
AddStringParam("ID", "ID da Notificação", "\"\"");
AddCondition(0, cf_trigger, "Na Notificação Clicada", "Comandos", "Na Notificação <b>{0}</b> clicada", "Executado quando a notificação for clicada.", "OnNotificationClicked");

// Actions
AddAction(0, af_none, "Deletar Notificações", "Comandos", "Deletar todas Notificações", "Deletar todas as notificações exibidas", "DeleteAllNotifications");

AddAnyTypeParam("ID :", "Digite a ID da Notificação.", "\"NotificaID\"");
AddAnyTypeParam("Título :", "Título da Notificação.", "\"Titulo\"");
AddAnyTypeParam("Texto :", "Texto da Notificação.", "\"Texto\"");
AddAnyTypeParam("Imagem :", "(Opcional) Coloque a URL de uma imagem.", "\"\"");

AddNumberParam("Tempo :", "Tempo para o Fade em millisegundos.","5000");

AddComboParamOption("Preto Transparente");
AddComboParamOption("Branco Transparente");
AddComboParamOption("Successo");
AddComboParamOption("Informar");
AddComboParamOption("Perigo");
AddComboParamOption("Erro Grave");
AddComboParamOption("Vermelho");
AddComboParamOption("Amarelo");
AddComboParamOption("Verde");
AddComboParamOption("Azul");
AddComboParam("Estilo :", "");

AddAction(1, af_none, "Exibir uma notificação", "Comandos", "Exibir a notificação <b>{0}</b>", "Exibir uma nova notificação", "AddNotificationClickable");

// Expressions
ACESDone();

var property_list = [
	new cr.Property(ept_combo, "Position","Em CIMA na Direita","Notification position.","Em CIMA na Direita|Em CIMA na Esquerda|Em BAIXO na Esquerda|Em BAIXO na Direita"),
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

const name 				= "prune";
const description = "Delete chat messages";
const adminOnly 	= true;
const args 				= true;
const usage 			= "<count>";

const execute = async (msg, args) =>
{
	const { channel } = msg;
	const count = args[0];

	if (!isNaN(count))
	{
		try
		{
			msg.delete();
			await channel.bulkDelete(count);
		} catch(e)
		{
			console.log(e);
		}
	}
};

module.exports = {
	name,
	description,
	adminOnly,
	args,
	usage,
	execute
};